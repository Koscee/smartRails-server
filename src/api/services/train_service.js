const { Train } = require('../models');
const ApiError = require('../exceptions/ApiError');
const { getStationByName } = require('./station_service');
const { getRouteById } = require('./route_service');
const { getTrainTypeById } = require('./trainType_service');

module.exports = {
  refineCarsNumberFormat: function (carriages) {
    return carriages.map((c) => {
      // remove spaces and characters that are not
      // letters or digits from car_no
      const carNums = c.cars.map((car) =>
        car.replace(/\s|([^A-Za-z0-9])/g, '').toUpperCase()
      );
      c.cars = carNums;
      return c;
    });
  },

  /**
   * Creates a new train using the provided trainData
   * @param {train} trainData an Object of train props
   * @param {String} userId id of the user adding the train
   * @returns a Promise of train Object
   */
  addTrain: async function (trainData, userId) {
    await getTrainTypeById(trainData.service_class);

    trainData.carriages = this.refineCarsNumberFormat(trainData.carriages);

    // set the current location of the tarin using the route start station
    const route = await getRouteById(trainData.route);
    const startStation = await getStationByName(route.start_station);
    trainData.curr_station = route.start_station;
    trainData.curr_location = startStation.location;
    // save the id of the user adding the train
    trainData.added_by = userId;

    // create and save new train to the db
    console.log(trainData);
    return Promise.resolve(Train.create(trainData));
  },

  /**
   * Finds all trains and returns their lists
   * @returns a Promise array of train objects.
   */
  getTrains: function () {
    return Promise.resolve(
      Train.find({})
        .sort({ updated_at: -1 })
        .populate('service_class', ['name', 'avg_speed', 'rail_type'])
        .populate('route', ['start_station', 'end_station'])
        .select('-__v')
    );
  },

  /**
   * Finds and a particular train using the provided trainId
   * @param {String} trainId an Id (String)
   * @returns a Promise of train Object
   */
  getTrainById: async function (trainId) {
    const mssg = `Train with id '${trainId}' was not found.`;

    try {
      // find the train if it exists
      const foundTrain = await Train.findById(trainId).select('-__v');

      // if doesnt exist throw notFound Error
      if (!foundTrain) {
        throw ApiError.notFound(mssg);
      }

      // if exist return the record
      return foundTrain;
    } catch (error) {
      // if invalid ID throw notFound Error
      if (error.kind === 'ObjectId') {
        throw ApiError.notFound(mssg);
      }
      throw error;
    }
  },

  /**
   * Finds and a particular train using the provided trainNo
   * @param {String} trainNo a train number (String)
   * @returns a Promise of train Object
   */
  getTrainByTrainNo: async function (trainNo) {
    const mssg = `Train '${trainNo}' doesn't exist.`;

    // find the train if it exists
    const foundTrain = await Train.findOne({ train_no: trainNo })
      .populate('service_class')
      .populate('route')
      .select('-__v');

    // if doesnt exist throw notFound Error
    if (!foundTrain) {
      throw ApiError.notFound(mssg);
    }

    // if exist return the record
    return foundTrain;
  },

  /**
   * Updates an existing train using the provided trainId and trainProps
   * @param {String} trainId a train id
   * @param {train} trainProps an Object of train props
   * @param {String} userId id of the user updating the train
   * @returns a Promise of updated train Object
   */
  updateTrain: async function (trainId, trainProps, userId) {
    // checks if train exists and handle errors
    const train = await this.getTrainById(trainId);

    if (trainProps.service_class) {
      // check if train sevrice type exist
      await getTrainTypeById(trainProps.service_class);
    }

    // if exist, set update props values
    Object.keys(trainProps).forEach((key) => {
      train[key] = trainProps[key];
    });

    // remove trailing spaces from car numbers
    train.carriages = this.refineCarsNumberFormat(train.carriages);
    // add the id of the user updating the train
    train.updated_by = userId;

    console.log('Updated Train', train);

    // save record
    return Promise.resolve(train.save());
  },

  /**
   * Deletes an existing train using the provided trainId
   * @param {String} trainId a train id
   * @returns a Promise of deleted train Object
   */
  deleteTrain: async function (trainId) {
    // checks if train exists and handle errors
    const train = await this.getTrainById(trainId);

    // if exist delete the record
    return Promise.resolve(train.deleteOne());
  },
};
