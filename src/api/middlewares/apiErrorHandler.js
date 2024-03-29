const ApiError = require('../exceptions/ApiError');
const HttpStatus = require('../utils/httpStatusCodes');

function apiErrorHandler(err, req, res, next) {
  console.log(err);

  if (err instanceof ApiError) {
    res.status(err.code).json({
      error: {
        status: err.code,
        // name: err.name || 'ApiError',
        message: err.message,
      },
    });
    return;
  }

  const statusCode = err.status || HttpStatus.INTERNAL_SERVER;
  res.status(statusCode).json({
    error: {
      status: statusCode,
      message: 'Something went wrong!!!',
      //   message: err.message,
    },
  });
}

module.exports = apiErrorHandler;
