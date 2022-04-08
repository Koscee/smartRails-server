const { Station } = require('../models');
const cityService = require('./city_service');
const ApiError = require('../exceptions/ApiError');
const filterObjectKeys = require('../utils/filterObjectKeys');

module.exports = {
  buildStationData: async function (data) {
    const { city, lon, lat } = data;
    const stationData = filterObjectKeys(data, ['city', 'lon', 'lat']);
    // check if city exist
    if (city) {
      const foundCity = await cityService.findCityByName(city);
      const { en_name, tag: cn_name, state } = foundCity;

      stationData.city = { en_name, cn_name, state };
    }

    if (lon && lat) {
      stationData.location = this.generateLocation(lon, lat);
    }

    return stationData;
  },

  // helper function that generates a location
  generateLocation: function (lon, lat) {
    const location = {
      type: 'Point',
      coordinates: [parseFloat(lon), parseFloat(lat)],
    };
    return location;
  },

  /* **** @METHOD: handles creating a new station *** */
  addStation: async function (stationProps) {
    // check if user is authorized
    // validation check
    // if (validation fails) throw new Error('mssg');

    const newStation = await this.buildStationData(stationProps);

    console.log('New Station ', newStation);

    // create and save new station to the db
    return Promise.resolve(Station.create(newStation));
  },

  /* **** @METHOD: handles getting all lists of stations *** */
  getStations: function () {
    return Promise.resolve(Station.find({}).sort({ updated_at: -1 }));
  },

  /* **** @METHOD: handles getting a particular station by its Id *** */
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

  /* **** @METHOD: handles getting a particular station by its name *** */
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

  /* **** @METHOD: handles updating a particlar station by its Id *** */
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
    const stationUpdateData = await this.buildStationData(stationProps);

    Object.keys(stationUpdateData).forEach((key) => {
      station[key] = stationUpdateData[key];
    });

    console.log('Update Station', station);

    // if exist update the record
    return Promise.resolve(station.save());
  },

  /* **** @METHOD: handles deleting a particular station by its Id *** */
  deleteStation: async function (stationId) {
    // 1. check if user is authorized

    // checks if station exists and handle errors
    const station = await this.getStationById(stationId);

    // if exist delete the record
    return Promise.resolve(station.deleteOne());
  },
};
