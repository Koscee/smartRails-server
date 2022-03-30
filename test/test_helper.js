const mongoose = require('mongoose');
const connectDB = require('../src/config/db');

before((done) => {
  connectDB('smartrails_test').then(() => done());
});

beforeEach((done) => {
  const { stations } = mongoose.connection.collections;

  stations
    .drop()
    .then(() => stations.ensureIndex({ 'location.coordinates': '2dsphere' }))
    .then(() => done())
    .catch(() => done());
});
