const mongoose = require('mongoose');

const { Schema } = mongoose;

const CarriageSchema = new Schema({
  seat_type: {
    type: String,
    required: [true, 'Train carriage seat type is required'],
  },

  cars: [String],

  max_seats_per_car: Number,
});

module.exports = CarriageSchema;
