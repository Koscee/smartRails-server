const { seatService } = require('../services');
const HttpStatus = require('../utils/httpStatusCodes');

module.exports = {
  /*
   * ****  @METHOD: handles GET request to
   * ****  /api/trains/seats   or
   * **** /api/trains/seats?train_no=&car_no=&sno=
   */
  getAll: async function (req, res, next) {
    // call the seatService getSeats method
    const seats = await seatService.getSeats(req.query);
    res.status(HttpStatus.OK).send(seats);
  },
};
