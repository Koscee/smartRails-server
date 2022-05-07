const HttpStatus = require('../utils/httpStatusCodes');
const ApiError = require('./ApiError');

class JwtError extends ApiError {
  constructor(name, message) {
    super();
    this.code = HttpStatus.UN_AUTHORIZED;
    this.name = name;
    this.message = message;
  }

  static verifyTokenError(name, mssg) {
    const message = mssg.replace('jwt', 'Token');
    return new JwtError(name, message);
  }
}

module.exports = JwtError;
