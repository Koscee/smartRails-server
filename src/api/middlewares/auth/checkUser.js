const ApiError = require('../../exceptions/ApiError');
const { User } = require('../../models');

/**
 * checks if user exists or not
 */
async function checkUser(req, res, next) {
  const user = await User.findById(req.user.id);
  // if user not found return an error
  if (!user) {
    next(ApiError.badRequest('Invalid user'));
  }

  next();
}

module.exports = checkUser;
