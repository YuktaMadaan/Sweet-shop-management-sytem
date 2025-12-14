const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

module.exports = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;
  await mongoose.connect(uri);
  // expose server so tests can access/stop if needed
  global.__MONGOSERVER__ = mongoServer;

  // ensure cleanup after all tests in this worker
  afterAll(async () => {
    try {
      await mongoose.connection.dropDatabase();
    } catch (e) {}
    try {
      await mongoose.connection.close();
    } catch (e) {}
    if (global.__MONGOSERVER__) {
      try { await global.__MONGOSERVER__.stop(); } catch (e) {}
    }
  });
};
