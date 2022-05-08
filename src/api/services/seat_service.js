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

    try {
      const seats = await Seat.find(query).sort({ train_no: 1 }).select('-__v');
      return seats;
    } catch (error) {
      throw ApiError.badRequest(`${error.path} is not a valid url query key`);
    }
  },

  /**
   * Finds an available seat using the seat type, depature station and arrival station
   * @param {String} type a seat type (String)
   * @param {String} depStation depature station (String)
   * @param {String} arrStation arrival station (String)
   * @returns a Promise of seat Object or null
   */
  getAvailableSeat: async function (type, depStation, arrStation) {
    // findOne funciton returns null if seat is not found
    const availableSeat = await Seat.findOne({
      type,
      status: true,
      aval_jrnys: { $elemMatch: { from: depStation, to: arrStation } },
    });
    return availableSeat;
  },

  updateSeats: async function (train_no, updateQuery) {
    try {
      await Seat.updateMany({ train_no }, updateQuery);
    } catch (error) {
      throw ApiError.serverError(`Unable to update ${train_no} seats`);
    }
  },
};
