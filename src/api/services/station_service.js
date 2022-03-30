const { Station } = require('../models');
const ApiError = require('../exceptions/ApiError');

module.exports = {
  addStation: function (stationData) {
    // check if user is authorized
    // validation check
    // if (validation fails) throw new Error('mssg');

    // create and save new station to the db
    return Promise.resolve(Station.create(stationData));
  },

  getStations: function () {
    return Promise.resolve(Station.find({}));
  },

  getStationById: async function (stationId) {
    const mssg = `Station with id '${stationId}' was not found.`;

    try {
      // find the station if it exists
      const foundStation = await Station.findById(stationId);

      // if doesnt exist throw notFound Error
      if (!foundStation) {
        throw ApiError.notFound(mssg);
      }

      // if exist return the record
      return foundStation;
    } catch (error) {
      // if invalid ID throw notFound Error
      if (error.kind === 'ObjectId') {
        throw ApiError.notFound(mssg);
      }
      throw error;
    }
  },

  getStationByName: async function (stationName) {
    const mssg = `Station with name '${stationName}' was not found.`;

    const foundStation = await Station.findOne({
      $or: [{ en_name: stationName }, { cn_name: stationName }],
    });

    // if doesnt exist throw notFound Error
    if (!foundStation) {
      throw ApiError.notFound(mssg);
    }

    // if exist return the record
    return foundStation;
  },

  updateStation: async function (stationId, stationProps) {
    // only these fields should be accessible for update in the frontEnd
    /* 
        type: "city",
        counters: ["A", "B", "C"],
        is_closed: false,
        service_hrs: "8:00am - 11:00pm",
        tel_no: "001213344"
    */

    // check if user is authorized

    // checks if station exists and handle errors
    const station = await this.getStationById(stationId);

    Object.keys(stationProps).forEach((key) => {
      station[key] = stationProps[key];
    });

    // if exist update the record
    return Promise.resolve(station.save());
  },

  deleteStation: async function (stationId) {
    // 1. check if user is authorized

    // checks if station exists and handle errors
    const station = await this.getStationById(stationId);

    // if exist delete the record
    return Promise.resolve(station.deleteOne());
  },
};
