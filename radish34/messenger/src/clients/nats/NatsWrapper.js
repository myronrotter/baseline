const natsutil = require('ts-natsutil');
const generalUtils = require('../../utils/generalUtils');
const { uuid } = require('uuidv4');
const logger = require('winston');
const Identity = require('../../db/models/Identity.js');
const Message = require('../../db/models/Message.js');

class NatsWrapper {

  constructor(config, getBearerToken) {
    this.bearerToken = null;
    this.service = undefined;
    this.config = config;
    this.getBearerToken = getBearerToken;

    this.getIdentities = generalUtils.getIdentities;
    this.findIdentity = generalUtils.findIdentity;
    this.getMessages = generalUtils.getMessages;
    this.forwardMessage = generalUtils.forwardMessage;
    this.getSingleMessage = generalUtils.getSingleMessage;
  }

  getSubscribedSubjects() {
    throw new Error("Method not implemented.");
  }

  async connect() {
    if (!this.bearerToken && this.getBearerToken) {
      this.bearerToken = await this.getBearerToken();
    }

    const servers = this.config.servers;
    const service = natsutil.natsServiceFactory({
      bearerToken: this.bearerToken,
      natsServers: typeof servers === `string` ? [servers] : servers,
    });

    const natsConnection = await service.connect();
    this.service = service;
    const self = this;
    if (typeof natsConnection.addEventListener === "function") {
      natsConnection.addEventListener("close", async () => {
        this.bearerToken = null;
        await self.connect();
      });
    } else {
      natsConnection.on("close", async () => {
        this.bearerToken = null;
        await self.connect();
      });
    }
  }

  disconnect() {
    if (this.service.isConnected()) {
      this.service.disconnect();
      this.service = null;
    }
    return Promise.resolve();
  }

  isConnected() {
    return this.service !== null;
  }

  async onReceive(subject, callback) {
    await this.service.subscribe(subject, (msg, err) => {
      if (err || !msg || !msg.data) {
        // TODO: log and throw
      } else {
        const data = typeof msg.data === `string` ? JSON.parse(msg.data) : msg.data;
        callback(data);
      }
    });
  }

  async publish(subject, data) {
    const messageId = uuid();
    data.uuid = messageId;
    let messageString = JSON.stringify(data);
    this.service.publish(subject, messageString);

    // Store message in database
    const time = Math.floor(Date.now() / 1000);
    let doc;
    try {
      doc = await Message.findOneAndUpdate(
        { _id: messageId },
        {
          _id: messageId,
          messageType: 'individual',
          recipientId,
          senderId,
          topic: subject,
          payload: messageString,
          sentDate: time,
        },
        { upsert: true, new: true },
      );
    } catch (err) {
      logger.error('Mongoose error:', err);
      return undefined;
    }
    return doc;
  }

  async request(subject, timeout, data = {}) {
    const response = await this.service.request(subject, timeout, JSON.stringify(data));
    return response;
  }

  async subscribe(subject, callback) {
    await this.service.subscribe(subject, (msg, err) => {
      if (err || !msg || !msg.data) {
        // TODO: log and throw
      } else {
        const parsedMsg = typeof msg === `string` ? JSON.parse(msg) : msg;
        const parsedData = typeof msg.data === `string` ? JSON.parse(msg.data) : msg.data;
        parsedMsg.data = parsedData;
        callback(parsedMsg);
      }
    });
  }

  async unsubscribe(subject) {
    const unsubscribeFrom = this.getSubjectsToUnsubscribeFrom(subject);
    unsubscribeFrom.forEach(sub => {
      this.service.unsubscribe(sub);
    });
  }

  async flush() {
    await this.service.flush();
  }

  getSubjectsToUnsubscribeFrom(subject) {
    const subscribedTo = this.service.getSubscribedSubjects();
    const unsubscribeFrom = [];

    // account for wildcards
    const substrsToMatch = subject.split(`>`)[0].split(`*`);
    subscribedTo.forEach(subscribedSubject => {
      let subjectIncludesAllSubstrings = true;
      substrsToMatch.forEach(match => {
        if (!subscribedSubject.includes(match) && match !== ``) {
          subjectIncludesAllSubstrings = false;
        }
      });
      if (subjectIncludesAllSubstrings) {
        unsubscribeFrom.push(subscribedSubject);
      }
    });

    return unsubscribeFrom;
  }
}

module.exports = NatsWrapper;
