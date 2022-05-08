const { SECURITY_CONSTANTS } = require('../../constants');
const ApiError = require('../../exceptions/ApiError');
const JwtError = require('../../exceptions/JwtError');
const { verifyToken } = require('../../utils/jwtTokenProvider');

const { HEADER_STRING, TOKEN_PREFIX } = SECURITY_CONSTANTS;

/**
 * a middleware that authenticate users by extracting
 * and decoding token from the request header
 */
function authUser(req, res, next) {
  // Get authorization header string
  const authHeader = req.headers[HEADER_STRING];

  // Check if token exists in header string
  const token =
    authHeader && authHeader.startsWith(TOKEN_PREFIX, 0)
      ? authHeader.split(' ')[1]
      : null;

  if (!token) {
    throw ApiError.unAuthorized('Unauthorized, invalid request header');
  }

  try {
    // Verify token
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    throw JwtError.verifyTokenError(err.name, err.message);
  }
}

module.exports = authUser;
