const { getDistance, convertDistance } = require('geolib');
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

    pathsInfo: {
      type: [
        {
          from: String,
          to: String,
          fromIndex: Number,
          toIndex: Number,
          distance: Number, // unit in km
          /* duration: String, // unit in sec  use train to calc this */
        },
      ],
      default: [],
    },

    total_dist: Number, // unit in km  required: ??
  },

  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

RouteSchema.pre('save', async function (next) {
  const Station = mongoose.model('station');

  const foundStations = await Station.find({ _id: { $in: this.stops } });
  const stations = foundStations.sort(
    (a, b) => this.stops.indexOf(a._id) - this.stops.indexOf(b._id)
  );
  // console.log('ROUTE STOPS', stations);

  const stopsCombination = [];

  for (let i = 0; i < stations.length - 1; i += 1) {
    const subStops = stations.slice(i + 1);
    for (let j = 0; j < subStops.length; j += 1) {
      // calculate distance
      const [lon1, lat1] = stations[i].location.coordinates;
      const [lon2, lat2] = subStops[j].location.coordinates;
      const distance = getDistance(
        { latitude: lat1, longitude: lon1 },
        { latitude: lat2, longitude: lon2 },
        7
      );
      const distanceInKm = convertDistance(distance, 'km');

      // generate combination of stops
      stopsCombination.push({
        from: stations[i].en_name,
        to: subStops[j].en_name,
        fromIndex: i,
        toIndex: i + j + 1,
        distance: distanceInKm,
      });
    }
  }

  this.pathsInfo = stopsCombination;

  next();
});

// this is the route which a train travels through
const Route = mongoose.model('route', RouteSchema);

module.exports = Route;
