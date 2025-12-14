const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

module.exports = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  // store uri in global to allow teardown to access the server instance
  global.__MONGO_SETUP__ = { mongoServer };
  process.env.MONGO_URI = uri;
  // connect mongoose so that tests can use existing connection
  await mongoose.connect(uri);
};
