const { cityService } = require('../services');
const HttpStatus = require('../utils/httpStatusCodes');

module.exports = {
  /* **** handles GET request to /api/cities *** */
  getAll: async function (req, res, next) {
    const stations = await cityService.getCities();
    res.status(HttpStatus.OK).send(stations);
  },
};
