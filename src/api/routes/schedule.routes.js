const router = require('express').Router();
const { ROLE } = require('../constants');
const { scheduleController } = require('../controllers');
const { authUser, checkUser, authRole } = require('../middlewares/auth');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * An Endpoint to create a new schedule
 * @route /api/trains/schedules
 * @access private
 */
router.post(
  '/',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(scheduleController.create)
);

/**
 * An Endpoint to fetch all the lists of schedules
 * @route /api/trains/schedules
 * @access public
 */
router.get('/', use(scheduleController.getAll));

/**
 * An Endpoint to fetch a particular schedule by id
 * @route /api/trains/schedules/:id
 * @access private
 */
router.get(
  '/:id',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(scheduleController.getById)
);

/**
 * An Endpoint to update a particular schedule by id
 * @route /api/trains/schedules
 * @access private
 */
router.put(
  '/',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(scheduleController.update)
);

/**
 * An Endpoint to delete a particular schedule by id
 * @route /api/trains/schedules/:trainNo
 * @access private
 */
router.delete(
  '/:trainNo',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(scheduleController.delete)
);

module.exports = router;
