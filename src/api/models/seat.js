const mongoose = require('mongoose');

const { Schema } = mongoose;

const SeatSchema = new Schema(
  {
    type: { type: String, required: [true, 'seat type is required'] },

    sno: { type: String, required: [true, 'seat number is required'] },

    car_no: { type: String, required: [true, 'car id of seat is required'] },

    train_no: {
      type: String,
      required: [true, 'train number of seat is required'],
    },

    aval_jrnys: {
      type: [
        {
          from: String,
          to: String,
          fromIndex: Number,
          toIndex: Number,
        },
      ],
      default: [],
    },

    status: { type: Boolean, default: 0 },
  },

  { strictQuery: 'throw' }
);

const Seat = mongoose.model('seat', SeatSchema);

module.exports = Seat;
