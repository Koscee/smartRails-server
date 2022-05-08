const ApiError = require('../exceptions/ApiError');
const { City } = require('../models');

module.exports = {
  /**
   * Finds and returns a list of all the cities
   * @returns a Promise array of city objects.
   */
  getCities: async function () {
    const cities = await City.find({}).select(['_id', 'en_name', 'tag']);
    return cities;
  },

  /**
   * Finds a particular city using the provided cityId
   * @param {Number} cityId an Id (String)
   * @returns a Promise of city Object
   */
  findCityById: async function (cityId) {
    const mssg = 'City provided was not found';
    try {
      const foundCity = await City.findById(cityId).select([
        'en_name',
        'tag',
        'state',
        '-_id',
      ]);

      if (!foundCity) throw ApiError.notFound(mssg);

      return foundCity;
    } catch (error) {
      // if invalid ID throw notFound Error
      if (error.kind === 'ObjectId') {
        throw ApiError.notFound(mssg);
      }
      throw error;
    }
  },

  /**
   * Finds a particular city using the provided cityName
   * @param {Number} cityName an Id (String)
   * @returns a Promise of city Object
   */
  findCityByName: async function (cityName) {
    const mssg = 'City provided was not found';

    const foundCity = await City.findOne({ en_name: cityName }).select([
      'en_name',
      'tag',
      'state',
      '-_id',
    ]);

    if (!foundCity) throw ApiError.notFound(mssg);

    return foundCity;
  },
};
