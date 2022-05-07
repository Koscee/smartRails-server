const ApiError = require('../exceptions/ApiError');
const { Passenger } = require('../models');

module.exports = {
  /**
   * Creates a new passenger using the provided passengerData
   * @param {passenger} passengerData an Object of passenger props
   * @param {string} userId an id of the user adding the passenger
   * @returns a Promise of passenger Object
   */
  addPassenger: async function (passengerData, userId) {
    const { ID_no, ID_type } = passengerData;

    // check if passenger exist
    const foundPassenger = await Passenger.findOne({ ID_no, ID_type }).count();
    if (foundPassenger) {
      throw ApiError.badRequest('This passenger already exist');
    }

    // link with user
    passengerData.added_by = userId;
    // create and save new passenger to the db
    console.log(passengerData);
    return Promise.resolve(Passenger.create(passengerData));
  },

  /**
   * Finds lists of passengers based on the searchFilter
   * @param {{}} searchFilter a query object
   * @returns a Promise array of passenger objects.
   */
  getPassengers: function (searchFilter) {
    return Promise.resolve(
      Passenger.find(searchFilter).sort({ updated_at: -1 }).select('-__v')
    );
  },

  /**
   * Finds a particular passenger using the provided passengerId
   * @param {String} passengerId an Id (String)
   * @returns a Promise of passenger Object
   */
  getPassengerById: async function (passengerId) {
    const mssg = `passenger with id '${passengerId}' was not found.`;

    try {
      // find the passenger if it exists
      const foundPassenger = await Passenger.findById(passengerId).select(
        '-__v'
      );

      // if doesnt exist throw notFound Error
      if (!foundPassenger) {
        throw ApiError.notFound(mssg);
      }
      // if exist return the record
      return foundPassenger;
    } catch (error) {
      // if invalid ID throw notFound Error
      if (error.kind === 'ObjectId') {
        throw ApiError.notFound(mssg);
      }
      throw error;
    }
  },

  /**
   * Updates an existing passenger using the provided passengerId and passengerProps
   * @param {String} passengerId a passenger id
   * @param {passenger} passengerProps an Object of passenger props
   * @returns a Promise of updated passenger Object
   */
  updatePassenger: async function (passengerId, passengerProps) {
    // checks if passenger exists and handle errors
    const passenger = await this.getPassengerById(passengerId);

    // if exist, set update props values
    Object.keys(passengerProps).forEach((key) => {
      passenger[key] = passengerProps[key];
    });

    console.log('Updated passenger', passenger);

    // save record
    return Promise.resolve(passenger.save());
  },

  /**
   * Deletes an existing passenger using the provided passengerId
   * @param {String} passengerId a passenger id
   * @returns a Promise of deleted passenger Object
   */
  deletePassenger: async function (passengerId) {
    // checks if passenger exists and handle errors
    const passenger = await this.getPassengerById(passengerId);

    // if exist delete the record
    return Promise.resolve(passenger.deleteOne());
  },
};
