const mongoose = require('mongoose');

const connectDB = async (dbURI) => {
  const mongodbURI = dbURI || 'mongodb://localhost:27017/smartrails';

  try {
    await mongoose.connect(mongodbURI);
    console.log(`Connected to database successfuly!`);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = connectDB;
