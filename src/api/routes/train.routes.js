const router = require('express').Router();
const { ROLE } = require('../constants');
const { trainController } = require('../controllers');
const { authUser, checkUser, authRole } = require('../middlewares/auth');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * An Endpoint to create a new train
 * @route /api/trains
 * @access private
 */
router.post(
  '/',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(trainController.create)
);

/**
 * An Endpoint to fetch all the lists of trains
 * @route /api/trains
 * @access private
 */
router.get(
  '/',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN, ROLE.ADMIN])],
  use(trainController.getAll)
);

/**
 * An Endpoint to fetch a particular train by id
 * @route /api/trains/:id
 * @access public
 */
router.get('/:id', use(trainController.getById));

/**
 * An Endpoint to update a particular train by id
 * @route /api/trains/:id
 * @access private
 */
router.put(
  '/:id',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(trainController.update)
);

/**
 * An Endpoint to delete a particular train by id
 * @route /api/trains/:id
 * @access private
 */
router.delete(
  '/:id',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(trainController.delete)
);

module.exports = router;
