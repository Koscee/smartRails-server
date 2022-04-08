const mongoose = require('mongoose');
const PointSchema = require('./schemas/PointSchema');

const { Schema } = mongoose;

const CitySchema = new Schema({
  en_name: {
    type: String,
    required: [true, 'City name is required'],
    unique: true,
  },

  cn_name: { type: String, unique: true },

  country: { type: String, required: [true, 'Country of city is required'] },

  tag: String,

  state: { type: String, required: [true, 'State of city is required'] },

  location: {
    type: PointSchema,
    required: [true, 'location is required'],
  },
});

const City = mongoose.model('city', CitySchema);

module.exports = City;
