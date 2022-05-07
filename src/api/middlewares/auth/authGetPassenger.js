const { ROLE } = require('../../constants');
const ApiError = require('../../exceptions/ApiError');
const { Passenger } = require('../../models');

async function authGetPassenger(req, res, next) {
  const { user } = req;
  const passengerId = req.params.id;

  // users with role "USER" can only access their own passengers
  if (user.role === ROLE.USER) {
    const passenger = await Passenger.findById(passengerId).select('added_by');
    if (passenger.added_by?.toString() !== user.id) {
      next(ApiError.forbidden('Not allowed'));
    }
  }

  next();
}

module.exports = authGetPassenger;
