const logger = require('winston');
const { startServer } = require('./server');
const { connect: dbConnect } = require('./db/connect');
const Config = require('../config');

// Import bull queues so they create redis connections
require('./queues/sendMessage');
require('./queues/receiveMessage');

const userIndex = process.env.USER_INDEX || 0;
const messagingType = Config.messagingType;
const { dbUrl } = Config[messagingType].users[userIndex];

const main = async () => {
  try {
    await dbConnect(dbUrl);
    await startServer();
  } catch (err) {
    logger.error(`Initialization error: ${err}`);
  }
};

main();
