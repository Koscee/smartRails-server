const mongoose = require('mongoose');
const PointSchema = require('./schemas/PointSchema');

const { Schema } = mongoose;

const StationSchema = new Schema(
  {
    en_name: {
      type: String,
      required: [true, 'Station name is required'],
      unique: true,
    },

    cn_name: { type: String, unique: true },

    type: {
      type: String,
      required: [true, 'Station type is required'],
      enum: {
        values: ['city', 'stop'],
        message: "'{VALUE}' is not a valid station type",
      },
    },

    location: {
      type: PointSchema,
      required: [true, 'location is required'],
    },

    city: {
      en_name: String,
      cn_name: String,
      state: String,
    },

    counters: [String],

    is_closed: { type: Boolean, default: false },

    tel_no: String,
  },

  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Station = mongoose.model('station', StationSchema);

module.exports = Station;
