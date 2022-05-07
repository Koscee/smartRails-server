const { trainService } = require('../services');
const HttpStatus = require('../utils/httpStatusCodes');

module.exports = {
  /* ****  @METHOD: handles POST request to /api/trains *** */
  create: async function (req, res, next) {
    const trainData = req.body;
    const { user } = req;

    // call the trainService addTrain method
    const newTrain = await trainService.addTrain(trainData, user.id);
    res.status(HttpStatus.CREATED).send(newTrain);
  },

  /* ****  @METHOD: handles GET request to /api/trains *** */
  getAll: async function (req, res, next) {
    // call the trainService getTrains method
    const trains = await trainService.getTrains();
    res.status(HttpStatus.OK).send(trains);
  },

  /* **** @METHOD: handles GET request to /api/trains/:id *** */
  getById: async function (req, res, next) {
    const trainId = req.params.id;

    const foundTrain = await trainService.getTrainById(trainId);
    res.status(HttpStatus.OK).send(foundTrain);
  },

  /* ****  @METHOD: handles PUT request to /api/trains *** */
  update: async function (req, res, next) {
    const trainId = req.params.id;
    const trainProps = req.body;
    const { user } = req;

    // call the trainService updateTrain method
    const updatedTrain = await trainService.updateTrain(
      trainId,
      trainProps,
      user.id
    );
    res.status(HttpStatus.OK).send(updatedTrain);
  },

  /* ****  @METHOD: handles DELETE request to /api/trains *** */
  delete: async function (req, res, next) {
    const trainId = req.params.id;

    // call the trainService deleteTrain method
    const deletedTrain = await trainService.deleteTrain(trainId);
    res
      .status(HttpStatus.OK)
      .send(`Train "${deletedTrain.train_no}" was deleted successfuly`);
  },
};
