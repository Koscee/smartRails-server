const HttpStatus = require('../utils/httpStatusCodes');

class ApiError extends Error {
  constructor(code, message) {
    super();
    this.code = code;
    this.message = message;
  }

  static notFound(msg) {
    return new ApiError(HttpStatus.NOT_FOUND, msg);
  }

  static badRequest(msg) {
    return new ApiError(HttpStatus.BAD_REQUEST, msg);
  }

  static serverError(msg) {
    return new ApiError(HttpStatus.INTERNAL_SERVER, msg);
  }
}

module.exports = ApiError;
