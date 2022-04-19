const { scheduleService } = require('../services');
const HttpStatus = require('../utils/httpStatusCodes');

module.exports = {
  /* ****  @METHOD: handles POST request to /api/trains/schedules *** */
  create: async function (req, res, next) {
    const scheduleData = req.body;

    // call the scheduleService addSchedule method
    const newSchedule = await scheduleService.addSchedules(scheduleData);
    res.status(HttpStatus.CREATED).send(newSchedule);
  },

  /* ****  @METHOD: handles GET request to /api/trains/schedules *** */
  getAll: async function (req, res, next) {
    // call the scheduleService getSchedules method
    const schedules = await scheduleService.getSchedules(req.query);
    res.status(HttpStatus.OK).send(schedules);
  },

  /* **** @METHOD: handles GET request to /api/trains/schedules/:id *** */
  getById: async function (req, res, next) {
    const scheduleId = req.params.id;

    const foundSchedule = await scheduleService.getScheduleById(scheduleId);
    res.status(HttpStatus.OK).send(foundSchedule);
  },

  /* ****  @METHOD: handles PUT request to /api/trains/schedules *** */
  update: async function (req, res, next) {
    const scheduleProps = req.body;

    // call the scheduleService updateSchedule method
    const updatedSchedule = await scheduleService.updateSchedules(
      scheduleProps
    );
    res.status(HttpStatus.OK).send(updatedSchedule);
  },

  /* ****  @METHOD: handles DELETE request to /api/trains/schedules/:trainNo *** */
  delete: async function (req, res, next) {
    const { trainNo } = req.params;

    // call the scheduleService deleteSchedule method
    await scheduleService.deleteSchedules(trainNo);
    res
      .status(HttpStatus.OK)
      .send(`Schedules for train '${trainNo}' was deleted successfuly`);
  },
};
