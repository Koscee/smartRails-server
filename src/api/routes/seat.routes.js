const router = require('express').Router();
const { ROLE } = require('../constants');
const { seatController } = require('../controllers');
const { authUser, authRole } = require('../middlewares/auth');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * An Endpoint to fetch all the lists of seats of trains
 * @route /api/trains/seats   (?train_no=<value>&car_no=<value>&sno=<value>)
 * @access private
 */
router.get(
  '/',
  [authUser, authRole([ROLE.SUPER_ADMIN])],
  use(seatController.getAll)
);

module.exports = router;
