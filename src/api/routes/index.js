const stationRoute = require('./station.routes');
const { apiErrorHandler, validationErrorHandler } = require('../middlewares');
const ApiError = require('../exceptions/ApiError');

module.exports = (app) => {
  app.use('/api/stations', stationRoute);

  /* error handling middlewares
  handles error thrown from any of the above route */

  app.use((req, res, next) => {
    const error = ApiError.notFound('Not found');
    next(error);
  });

  app.use(validationErrorHandler);

  app.use(apiErrorHandler);
};
