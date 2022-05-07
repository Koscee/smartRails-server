const router = require('express').Router();
const { ROLE } = require('../constants');
const { systemRecordController } = require('../controllers');
const { authUser, checkUser, authRole } = require('../middlewares/auth');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * An Endpoint to fetch the summary of system record
 * This will be used for the admin dashboard
 * @route /api/record/summary
 * @access private
 */
router.get(
  '/summary',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN, ROLE.ADMIN])],
  use(systemRecordController.getSystemRecordsSummary)
);

module.exports = router;
