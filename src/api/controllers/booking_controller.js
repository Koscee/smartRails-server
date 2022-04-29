const HttpStatus = require('../utils/httpStatusCodes');
const { bookingService } = require('../services');

module.exports = {
  /* ****  @METHOD: handles POST request to /api/bookings *** */
  create: async function (req, res, next) {
    const requestData = req.body;

    // call the bookingService addBooking method
    const newOrder = await bookingService.addBooking(requestData);
    res.status(HttpStatus.CREATED).send(newOrder);
  },

  /* ****  @METHOD: handles GET request to /api/bookings *** */
  getAll: async function (req, res, next) {
    // call the bookingService getBookings method
    const bookings = await bookingService.getBookings();
    res.status(HttpStatus.OK).send(bookings);
  },

  /* **** @METHOD: handles GET request to /api/bookings/:id *** */
  getById: async function (req, res, next) {
    const bookingId = req.params.id;
    const foundOrder = await bookingService.getBookingById(bookingId);

    res.status(HttpStatus.OK).send(foundOrder);
  },

  /* **** @METHOD: handles GET request to /api/bookings/cancel/:id *** */
  cancel: async function (req, res, next) {
    const bookingId = req.params.id;
    const result = await bookingService.cancelBooking(bookingId);

    res.status(HttpStatus.OK).send(result);
  },

  /* ****  @METHOD: handles PUT request to /api/bookings/:id *** */
  update: async function (req, res, next) {
    const bookingId = req.params.id;
    const requestData = req.body;

    // call the bookingService updateBooking method
    const updatedOrder = await bookingService.updateBooking(
      bookingId,
      requestData
    );

    res.status(HttpStatus.OK).send(updatedOrder);
  },

  /* ****  @METHOD: handles DELETE request to /api/bookings/:id *** */
  delete: async function (req, res, next) {
    const bookingId = req.params.id;

    // call the bookingService deleteBooking method
    await bookingService.deleteBooking(bookingId);

    res.status(HttpStatus.OK).send('Order was deleted successfuly');
  },
};
