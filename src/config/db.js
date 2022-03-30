const mongoose = require('mongoose');

const connectDB = async (dbName) => {
  const dbURI = `mongodb://localhost:27017/${dbName}`;

  try {
    await mongoose.connect(dbURI);
    console.log(`Connected to ${dbName} database successfuly!`);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = connectDB;
