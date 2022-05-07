const { systemRecordService } = require('../services');
const HttpStatus = require('../utils/httpStatusCodes');

module.exports = {
  /* ****  @METHOD: handles GET request to /api/record/summary *** */
  getSystemRecordsSummary: async function (req, res, next) {
    const recordSummary = await systemRecordService.generateRecordsSummary();
    res.status(HttpStatus.OK).send(recordSummary);
  },
};
