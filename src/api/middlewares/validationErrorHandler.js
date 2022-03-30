const HttpStatus = require('../utils/httpStatusCodes');

function validationErrorHandler(err, req, res, next) {
  const errorMap = {};
  const statusCode = HttpStatus.BAD_REQUEST;

  if (err.code && err.code === 11000) {
    console.log(err.name);

    Object.keys(err.keyValue).forEach((key) => {
      errorMap[key] = `'${err.keyValue[key]}' already exist`;
    });

    console.log(errorMap);
    res.status(statusCode).send({ error: { status: statusCode, ...errorMap } });

    return;
  }

  if (err.name && err.name === 'ValidationError') {
    console.log(err.name);

    Object.keys(err.errors).forEach((key) => {
      errorMap[key] = err.errors[key].message;
    });

    console.log(errorMap);
    res.status(statusCode).send({ error: { status: statusCode, ...errorMap } });

    return;
  }

  next(err);
}

module.exports = validationErrorHandler;
