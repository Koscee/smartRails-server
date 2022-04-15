const { trainTypeService } = require('../services');
const HttpStatus = require('../utils/httpStatusCodes');

module.exports = {
  /* ****  @METHOD: handles POST request to /api/trains/types *** */
  create: async function (req, res, next) {
    const trainTypeData = req.body;

    // call the trainTypeService addTrainType method
    const newTrainType = await trainTypeService.addTrainType(trainTypeData);
    res.status(HttpStatus.CREATED).send(newTrainType);
  },

  /* ****  @METHOD: handles GET request to /api/trains/types *** */
  getAll: async function (req, res, next) {
    // call the trainTypeService getTrainTypes method
    const trainTypes = await trainTypeService.getTrainTypes();
    res.status(HttpStatus.OK).send(trainTypes);
  },

  /* **** @METHOD: handles GET request to /api/trains/types/:id *** */
  getById: async function (req, res, next) {
    const trainTypeId = req.params.id;

    const foundTrainType = await trainTypeService.getTrainTypeById(trainTypeId);
    res.status(HttpStatus.OK).send(foundTrainType);
  },

  /* ****  @METHOD: handles PUT request to /api/trains/types *** */
  update: async function (req, res, next) {
    const trainTypeId = req.params.id;
    const trainTypeProps = req.body;

    // call the trainTypeService updateTrainType method
    const updatedTrainType = await trainTypeService.updateTrainType(
      trainTypeId,
      trainTypeProps
    );
    res.status(HttpStatus.OK).send(updatedTrainType);
  },

  /* ****  @METHOD: handles DELETE request to /api/trains/types *** */
  delete: async function (req, res, next) {
    const trainTypeId = req.params.id;

    // call the trainTypeService deleteTrainType method
    const deletedTrainType = await trainTypeService.deleteTrainType(
      trainTypeId
    );
    res
      .status(HttpStatus.OK)
      .send(`Class type "${deletedTrainType.name}" was deleted successfuly`);
  },
};
