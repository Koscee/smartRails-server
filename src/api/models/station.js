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

    // routes: { type: Schema.Types.ObjectId, ref: route },

    city: {
      en_name: String,
      cn_name: String,
      state: String,
    }, // populate to get city en_name, tag and state

    counters: [String],

    is_closed: { type: Boolean, default: false },

    service_hrs: String,

    tel_no: String,
  },

  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Station = mongoose.model('station', StationSchema);

module.exports = Station;
