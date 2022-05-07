const { ROLE } = require('../constants');
const { passengerService } = require('../services');
const HttpStatus = require('../utils/httpStatusCodes');

module.exports = {
  /* ****  @METHOD: handles POST request to /api/passengers *** */
  create: async function (req, res, next) {
    const passengerData = req.body;
    const { user } = req;

    // call the passengerService addPassenger method
    const newPassenger = await passengerService.addPassenger(
      passengerData,
      user.id
    );
    res.status(HttpStatus.CREATED).send(newPassenger);
  },

  /* ****  @METHOD: handles GET request to /api/passengers *** */
  getAll: async function (req, res, next) {
    const { user } = req;
    const isDefaultUser = user.role === ROLE.USER;
    const searchFilter = isDefaultUser ? { added_by: user.id } : {};
    // call the passengerService getPassengers method
    const passengers = await passengerService.getPassengers(searchFilter);
    res.status(HttpStatus.OK).json(passengers);
  },

  /* **** @METHOD: handles GET request to /api/passengers/:id *** */
  getById: async function (req, res, next) {
    const passengerId = req.params.id;
    const foundPassenger = await passengerService.getPassengerById(passengerId);

    res.status(HttpStatus.OK).send(foundPassenger);
  },

  /* ****  @METHOD: handles PUT request to /api/passengers *** */
  update: async function (req, res, next) {
    const passengerId = req.params.id;
    const passengerProps = req.body;

    // call the passengerService updatePassenger method
    const updatedPassenger = await passengerService.updatePassenger(
      passengerId,
      passengerProps
    );

    res.status(HttpStatus.OK).send(updatedPassenger);
  },

  /* ****  @METHOD: handles DELETE request to /api/passengers *** */
  delete: async function (req, res, next) {
    const passengerId = req.params.id;

    // call the passengerService deletePassenger method
    await passengerService.deletePassenger(passengerId);

    res.status(HttpStatus.OK).send('Passenger was deleted successfuly');
  },
};
