const { ROLE } = require('../../constants');
const ApiError = require('../../exceptions/ApiError');
const { Booking } = require('../../models');

async function authGetBooking(req, res, next) {
  const { user } = req;
  const bookingId = req.params.id;

  // users with role "USER" can only access their own booking
  if (user.role === ROLE.USER) {
    const order = await Booking.findById(bookingId).select('booked_by');
    if (order.booked_by?.toString() !== user.id) {
      next(ApiError.forbidden('Not allowed'));
    }
  }

  next();
}

module.exports = authGetBooking;
