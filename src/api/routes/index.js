const cityRoute = require('./city.routes');
const stationRoute = require('./station.routes');
const routeRoute = require('./route.routes');
const trainTypeRoute = require('./trainType.routes');
const { apiErrorHandler, validationErrorHandler } = require('../middlewares');
const ApiError = require('../exceptions/ApiError');

module.exports = (app) => {
  app.use('/api/cities', cityRoute);
  app.use('/api/stations', stationRoute);
  app.use('/api/trains/routes', routeRoute);
  app.use('/api/trains/types', trainTypeRoute);

  /* error handling middlewares
  handles error thrown from any of the above route */

  app.use((req, res, next) => {
    const error = ApiError.notFound('Not found');
    next(error);
  });

  app.use(validationErrorHandler);

  app.use(apiErrorHandler);
};
