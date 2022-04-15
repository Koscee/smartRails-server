const { Seat } = require('../models');
const ApiError = require('../exceptions/ApiError');

module.exports = {
  /**
   * Finds seats of trains and return their lists
   * accepts query options to filter search by train_no, car_no and sno
   * @param {{} | {train_no?: String, car_no?: String, sno?: String}} searchQuery
   * @returns a Promise array of seat objects.
   */
  getSeats: async function (searchQuery) {
    const filters = Object.keys(searchQuery).map((key) => ({
      [key]: searchQuery[key],
    }));
    const query = filters.length < 1 ? {} : { $and: [...filters] };

    console.log('QUERY FILTERS', filters);

    try {
      const seats = await Seat.find(query).sort({ train_no: 1 }).select('-__v');
      console.log('SEATS COUNT', seats.length);
      return seats;
    } catch (error) {
      //   console.log('Error Keys', Object.keys(error));
      throw ApiError.badRequest(`${error.path} is not a valid url query key`);
    }
  },
};
