const router = require('express').Router();
const { ROLE } = require('../constants');
const { trainTypeController } = require('../controllers');
const { authUser, checkUser, authRole } = require('../middlewares/auth');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.use(authUser, checkUser);

/**
 * An Endpoint to create a new train type
 * @route /api/trains/types
 * @access private
 */
router.post('/', authRole([ROLE.SUPER_ADMIN]), use(trainTypeController.create));

/**
 * An Endpoint to fetch all the lists of trainTypes
 * @route /api/trains/types
 * @access private
 */
router.get(
  '/',
  authRole([ROLE.SUPER_ADMIN, ROLE.ADMIN]),
  use(trainTypeController.getAll)
);

/**
 * An Endpoint to fetch a particular trainType by id
 * @route /api/trains/types/:id
 * @access private
 */
router.get(
  '/:id',
  authRole([ROLE.SUPER_ADMIN, ROLE.ADMIN]),
  use(trainTypeController.getById)
);

/**
 * An Endpoint to update a particular trainType by id
 * @route /api/trains/types/:id
 * @access private
 */
router.put(
  '/:id',
  authRole([ROLE.SUPER_ADMIN]),
  use(trainTypeController.update)
);

/**
 * An Endpoint to delete a particular trainType by id
 * @route /api/trains/types/:id
 * @access private
 */
router.delete(
  '/:id',
  authRole([ROLE.SUPER_ADMIN]),
  use(trainTypeController.delete)
);

module.exports = router;
