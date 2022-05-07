const router = require('express').Router();
const { ROLE } = require('../constants');
const { stationController } = require('../controllers');
const { authUser, checkUser, authRole } = require('../middlewares/auth');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * @route /api/stations
 * @description Creates a new station
 * @access private
 */
router.post(
  '/',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(stationController.create)
);

/**
 * @route /api/stations
 * @description Returns a list of all the stations
 * @access public
 */
router.get('/', use(stationController.getAll));

/**
 * @route /api/stations/:id
 * @description Returns a single station by the given id
 * @access public
 */
router.get('/:id', use(stationController.getById));

/**
 * @route /api/stations/name/:stationName
 * @description Returns a single station by the given name
 * @access public
 */
router.get('/name/:stationName', use(stationController.getByName));

/**
 * @route /api/stations/id
 * @description Updates an existing station
 * @access private
 */
router.put(
  '/:id',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(stationController.update)
);

/**
 * @route /api/stations/id
 * @description Deletes an existing station
 * @access private
 */
router.delete(
  '/:id',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(stationController.delete)
);

module.exports = router;
