const router = require('express').Router();
const { ROLE } = require('../constants');
const { userController } = require('../controllers');
const ApiError = require('../exceptions/ApiError');
const { authUser, checkUser, authRole } = require('../middlewares/auth');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const setAsAdmin = (req, res, next) => {
  req.isAdmin = true;
  next();
};

const authUpdate = (req, res, next) => {
  if (req.user.role !== ROLE.SUPER_ADMIN && req.user.id !== req.params.id) {
    throw ApiError.forbidden('Not allowed to update this user');
  }
  next();
};

/**
 * An Endpoint to fetch all the lists of users
 * @route /api/users
 * @access private
 */
router.get(
  '/',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN, ROLE.ADMIN])],
  use(userController.getAll)
);

/**
 * An Endpoint for user registration
 * @route /api/users/register
 * @access public
 */
router.post('/register', use(userController.register));

/**
 * An Endpoint for admin registration
 * @route /api/users/admin/register
 * @access private
 */
router.post('/admin/register', setAsAdmin, use(userController.register));

/**
 * An Endpoint for user login
 * @route /api/users/login
 * @access public
 */
router.post('/login', use(userController.login));

/**
 * An Endpoint to logout a user
 * @route /api/users/logout
 * @access private
 */
router.get('/logout', [authUser, checkUser], use(userController.logout));

/**
 * An Endpoint to fetch a particular user by id
 * @route /api/users/:id
 * @access private
 */
router.get('/:id', [authUser, checkUser], use(userController.getById));

/**
 * An Endpoint to update a particular user by id
 * @route /api/users/:id
 * @access private
 */
router.put(
  '/:id',
  [authUser, checkUser, authUpdate],
  use(userController.update)
);

/**
 * An Endpoint to delete a particular user by id
 * @route /api/users/:id
 * @access private
 */
router.delete(
  '/:id',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(userController.delete)
);

module.exports = router;
