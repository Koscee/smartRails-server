const ApiError = require('../../exceptions/ApiError');
/**
 * check if the user role is allowed access or not
 * @param {[string]} roles
 * @returns a middleware function
 */
function authRole(roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user?.role)) {
      throw ApiError.forbidden('Access denied');
    }

    next();
  };
}

module.exports = authRole;
