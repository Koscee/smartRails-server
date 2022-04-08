const mongoose = require('mongoose');

const { Schema } = mongoose;

const RouteSchema = new Schema(
  {
    start_station: {
      type: String,
      required: [true, 'start_station is required'],
    },

    end_station: {
      type: String,
      required: [true, 'end_station is required'],
    },

    stops: [{ type: Schema.Types.ObjectId, ref: 'station' }],

    // pathsInfo: [
    //   {
    //     originIndex: Number,
    //     destinationIndex: Number,
    //     distance: Number, // unit in km
    //   },
    // ],

    total_dist: Number, // unit in km  required: ??
  },

  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// this is the route which a train travels through
const Route = mongoose.model('route', RouteSchema);

module.exports = Route;
