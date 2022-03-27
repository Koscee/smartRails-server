const mongoose = require('mongoose');

const dbName = process.env.TEST_DB || 'smartrails';
const dbURI = `mongodb://localhost:27017/${dbName}`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log(`Connected to ${dbName} database successfuly!`);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = connectDB;
