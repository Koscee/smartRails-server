const { TrainType } = require('../models');
const ApiError = require('../exceptions/ApiError');

module.exports = {
  /**
   * Creates a new trainType using the provided trainTypeData
   * @param {trainType} trainTypeData an Object of trainType props
   * @returns a Promise of trainType Object
   */
  addTrainType: function (trainTypeData) {
    // check if user is authorized
    // validation check
    const { max_speed, min_speed } = trainTypeData;

    trainTypeData.max_speed = parseFloat(max_speed);
    trainTypeData.min_speed = parseFloat(min_speed);

    console.log('New TrainClass', trainTypeData);

    // create and save new station to the db
    return Promise.resolve(TrainType.create(trainTypeData));
  },

  /**
   * Finds all trainTypes and returns their lists
   * @returns a Promise array of trainType objects.
   */
  getTrainTypes: function () {
    return Promise.resolve(
      TrainType.find({}).sort({ updated_at: -1 }).select('-__v')
    );
  },

  /**
   * Finds and a particular trainType using the provided trainTypeId
   * @param {Number} trainTypeId an Id (String)
   * @returns a Promise of trainType Object
   */
  getTrainTypeById: async function (trainTypeId) {
    const mssg = `Train service type with id '${trainTypeId}' was not found.`;

    try {
      // find the station if it exists
      const foundTrainType = await TrainType.findById(trainTypeId).select(
        '-__v'
      );

      // if doesnt exist throw notFound Error
      if (!foundTrainType) {
        throw ApiError.notFound(mssg);
      }

      // if exist return the record
      return foundTrainType;
    } catch (error) {
      // if invalid ID throw notFound Error
      if (error.kind === 'ObjectId') {
        throw ApiError.notFound(mssg);
      }
      throw error;
    }
  },

  /**
   * Updates an existing trainType using the provided trainTypeId and trainTypeProps
   * @param {Number} trainTypeId a trainType id
   * @param {trainType} trainTypeProps an Object of trainType props
   * @returns a Promise of trainType Object
   */
  updateTrainType: async function (trainTypeId, trainTypeProps) {
    // check if user is authorized

    // checks if trainType exists and handle errors
    const trainType = await this.getTrainTypeById(trainTypeId);

    // if exist, set update props values
    Object.keys(trainTypeProps).forEach((key) => {
      trainType[key] = trainTypeProps[key];
    });

    console.log('Updated TrainType', trainType);

    // save record
    return Promise.resolve(trainType.save());
  },

  /**
   * Deletes an existing trainType using the provided trainTypeId
   * @param {Number} trainTypeId a trainType id
   * @returns a Promise of trainType Object
   */
  deleteTrainType: async function (trainTypeId) {
    // 1. check if user is authorized

    // checks if trainType exists and handle errors
    const trainType = await this.getTrainTypeById(trainTypeId);

    // if exist delete the record
    return Promise.resolve(trainType.deleteOne());
  },
};
