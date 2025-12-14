const mongoose = require('mongoose');

module.exports = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } catch (err) {
    // ignore
  }
  if (global.__MONGO_SETUP__ && global.__MONGO_SETUP__.mongoServer) {
    await global.__MONGO_SETUP__.mongoServer.stop();
  }
};
