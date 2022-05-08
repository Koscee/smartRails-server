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

  /**
   * Creates a new station using the provided stationProps
   * @param {station} stationProps an Object of station props
   * @returns a Promise of station Object
   */
  addStation: async function (stationProps) {
    // build station data
    const newStation = await this.buildStationData(stationProps);

    // create and save new station to the db
    return Promise.resolve(Station.create(newStation));
  },

  /**
   * Finds and returns a list of all the stations
   * @returns a Promise array of station objects.
   */
  getStations: function () {
    return Promise.resolve(Station.find({}).sort({ updated_at: -1 }));
  },

  /**
   * Finds a particular station using the provided stationId
   * @param {String} stationId an Id (String)
   * @returns a Promise of station Object
   */
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

  /**
   * Finds a particular station using the provided stationName
   * @param {String} stationName
   * @returns a Promise of station Object
   */
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

  /**
   * Updates an existing station using the provided stationId and stationProps
   * @param {String} stationId a station id
   * @param {station} stationProps an Object of station props
   * @returns a Promise of updated station Object
   */
  updateStation: async function (stationId, stationProps) {
    // checks if station exists and handle errors
    const station = await this.getStationById(stationId);
    const stationUpdateData = await this.buildStationData(stationProps);

    Object.keys(stationUpdateData).forEach((key) => {
      station[key] = stationUpdateData[key];
    });

    // if exist update the record
    return Promise.resolve(station.save());
  },

  /**
   * Deletes an existing station using the provided stationId
   * @param {String} stationId a station id
   * @returns a Promise of deleted station Object
   */
  deleteStation: async function (stationId) {
    // checks if station exists and handle errors
    const station = await this.getStationById(stationId);

    // if exist delete the record
    return Promise.resolve(station.deleteOne());
  },
};
