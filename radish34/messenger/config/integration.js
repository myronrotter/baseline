
module.exports = {
  mongo: {
    debug: true,
    bufferMaxEntries: 8,
    firstConnectRetryDelaySecs: 5,
  },
  whisper: {
    users: [
      {
        ipAddress: 'geth-node',
        messengerPort: '8546',
        origin: 'mychat2',
        dbUrl: 'mongodb://mongo-buyer:27017/radish34_test',
      },
      {
        ipAddress: 'geth-node',
        messengerPort: '8548',
        origin: 'mychat2',
        dbUrl: 'mongodb://mongo-supplier1:27017/radish34_test',
      },
      {
        ipAddress: 'geth-node',
        messengerPort: '8550',
        origin: 'mychat2',
        dbUrl: 'mongodb://mongo-supplier2:27017/radish34_test',
      },
    ],
  },
  nats: {
    users: [
      {
        ipAddress: 'nats-buyer',
        messengerPort: '4221',
        dbUrl: 'mongodb://mongo-buyer:27017/radish34_test',
        servers: [],
      },
      {
        ipAddress: 'nats-supplier1',
        messengerPort: '4221',
        dbUrl: 'mongodb://mongo-supplier1:27017/radish34_test',
        servers: [],
      },
      {
        ipAddress: 'nats-supplier2',
        messengerPort: '4221',
        dbUrl: 'mongodb://mongo-supplier2:27017/radish34_test',
        servers: [],
      },
    ],
  },
  encryptionKey: process.env.ENCRYPT_KEY, // Must be 256 bits (32 characters)
};
