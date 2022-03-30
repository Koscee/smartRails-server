const { stationService } = require('../services');
const HttpStatus = require('../utils/httpStatusCodes');

module.exports = {
  /* **** handles POST request to /api/stations *** */
  create: async function (req, res, next) {
    const stationData = req.body;

    // call the stationService addStation method
    const newStation = await stationService.addStation(stationData);
    res.status(HttpStatus.CREATED).send(newStation);
  },

  /* **** handles GET request to /api/stations *** */
  getAll: async function (req, res, next) {
    const stations = await stationService.getStations();
    res.status(HttpStatus.OK).send(stations);
  },

  /* **** handles GET request to /api/stations/:id *** */
  getById: async function (req, res, next) {
    const stationId = req.params.id;

    const foundStation = await stationService.getStationById(stationId);
    res.status(HttpStatus.OK).send(foundStation);
  },

  /* **** handles GET request to /api/stations/name/:stationName *** */
  getByName: async function (req, res, next) {
    const { stationName } = req.params;

    const foundStation = await stationService.getStationByName(stationName);
    res.status(HttpStatus.OK).send(foundStation);
  },

  /* **** handles PUT request to /api/stations/:id *** */
  update: async function (req, res, next) {
    const stationId = req.params.id;
    const stationProps = req.body;

    // call the stationService updateStation method
    const updatedStation = await stationService.updateStation(
      stationId,
      stationProps
    );
    res.status(HttpStatus.OK).send(updatedStation);
  },

  /* **** handles DELETE request to /api/stations/:id *** */
  delete: async function (req, res, next) {
    const stationId = req.params.id;

    // call stationService deleteStation method
    const deletedStation = await stationService.deleteStation(stationId);

    res
      .status(HttpStatus.OK)
      .send(`${deletedStation.en_name} station was deleted successfuly`);
  },
};
