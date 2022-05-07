const router = require('express').Router();
const { ROLE } = require('../constants');
const { bookingController } = require('../controllers');
const {
  authUser,
  checkUser,
  authRole,
  authGetBooking,
} = require('../middlewares/auth');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * An Endpoint to create booking
 * @route /api/bookings
 * @access private
 */
router.post('/', [authUser, checkUser], use(bookingController.create));

/**
 * An Endpoint to fetch all the lists of bookings
 * @route /api/bookings
 * @access private
 */
router.get('/', [authUser, checkUser], use(bookingController.getAll));

/**
 * An Endpoint to fetch a particular order (booking) by id
 * @route /api/bookings/:id
 * @access public
 */
router.get('/:id', use(bookingController.getById));

/**
 * An Endpoint to cancel booking by id
 * @route /api/bookings/:id
 * @access private
 */
router.get(
  '/cancel/:id',
  [authUser, checkUser, authGetBooking],
  use(bookingController.cancel)
);

/**
 * An Endpoint to update a particular order (booking) by id
 * @route /api/bookings/:id
 * @access private
 */
router.put(
  '/:id',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(bookingController.update)
);

/**
 * An Endpoint to delete a particular order (booking) by id
 * @route /api/bookings/:id
 * @access private
 */
router.delete(
  '/:id',
  [authUser, checkUser, authRole([ROLE.SUPER_ADMIN])],
  use(bookingController.delete)
);

module.exports = router;
