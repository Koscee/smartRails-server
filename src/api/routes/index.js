const cityRoute = require('./city.routes');
const stationRoute = require('./station.routes');
const routeRoute = require('./route.routes');
const trainTypeRoute = require('./trainType.routes');
const seatRoute = require('./seat.routes');
const scheduleRoute = require('./schedule.routes');
const trainRoute = require('./train.routes');
const passengerRoute = require('./passenger.routes');
const { apiErrorHandler, validationErrorHandler } = require('../middlewares');
const ApiError = require('../exceptions/ApiError');

module.exports = (app) => {
  /**
   * NOTE: The order of the below endpoints matters
   * "/api/trains" must be placed after:
   * "/api/trains/routes", "/api/trains/types", "/api/trains/seats" & "/api/trains/schedules"
   * because express calls each middleware synchronously
   */
  app.use('/api/cities', cityRoute);
  app.use('/api/stations', stationRoute);
  app.use('/api/trains/routes', routeRoute);
  app.use('/api/trains/types', trainTypeRoute);
  app.use('/api/trains/seats', seatRoute);
  app.use('/api/trains/schedules', scheduleRoute);
  app.use('/api/trains', trainRoute);
  app.use('/api/passengers', passengerRoute);

  /* error handling middlewares
   * handles error thrown from any of the above route
   */

  app.use((req, res, next) => {
    const error = ApiError.notFound('Not found');
    next(error);
  });

  app.use(validationErrorHandler);

  app.use(apiErrorHandler);
};
