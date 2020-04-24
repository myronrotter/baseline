
module.exports = {
  mongo: {
    debug: true,
    bufferMaxEntries: 8,
    firstConnectRetryDelaySecs: 5,
  },
  logging: {
    level: 'debug'
  },
  whisper: {
    users: [
      {
        ipAddress: 'localhost',
        messengerPort: '8548',
        origin: 'mychat2',
        dbUrl: 'mongodb://localhost:27117/radish34_test',
        redisUrl: 'redis://localhost:6379',
      },
    ],
  },
  nats: {
    users: [
      {
        ipAddress: 'localhost',
        messengerPort: '4221',
        dbUrl: 'mongodb://localhost:27017/radish34_test',
        redisUrl: 'redis://localhost:6379',
      },
    ],
  },
  encryptionKey: 'testKey0123456789012345678901234', // Must be 256 bits (32 characters)
};
