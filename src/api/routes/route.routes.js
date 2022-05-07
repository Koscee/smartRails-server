const router = require('express').Router();
const { ROLE } = require('../constants');
const { routeController } = require('../controllers');
const { authUser, checkUser, authRole } = require('../middlewares/auth');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * An Endpoint to create a new route
 * @route /api/trains/routes
 * @access private
 */
router.post(
  '/',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(routeController.create)
);

/**
 * An Endpoint to fetch all the lists of routes
 * @route /api/trains/routes
 * @access public
 */
router.get('/', use(routeController.getAll));

/**
 * An Endpoint to fetch a particular route by id
 * @route /api/trains/routes/:id
 * @access private
 */
router.get(
  '/:id',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(routeController.getById)
);

/**
 * An Endpoint to update a particular route by id
 * @route /api/trains/routes/:id
 * @access private
 */
router.put(
  '/:id',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(routeController.update)
);

/**
 * An Endpoint to delete a particular route by id
 * @route /api/trains/routes/:id
 * @access private
 */
router.delete(
  '/:id',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(routeController.delete)
);

module.exports = router;
