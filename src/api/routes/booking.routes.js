const router = require('express').Router();
const { bookingController } = require('../controllers');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * An Endpoint to create booking
 * @route /api/bookings
 * @access private
 */
router.post('/', use(bookingController.create));

/**
 * An Endpoint to fetch all the lists of bookings
 * @route /api/bookings
 * @access private
 */
router.get('/', use(bookingController.getAll));

/**
 * An Endpoint to fetch a particular order (booking) by id
 * @route /api/bookings/:id
 * @access private
 */
router.get('/:id', use(bookingController.getById));

/**
 * An Endpoint to cancel booking by id
 * @route /api/bookings/:id
 * @access private
 */
router.get('/cancel/:id', use(bookingController.cancel));

/**
 * An Endpoint to update a particular order (booking) by id
 * @route /api/bookings/:id
 * @access private
 */
router.put('/:id', use(bookingController.update));

/**
 * An Endpoint to delete a particular order (booking) by id
 * @route /api/bookings/:id
 * @access private
 */
router.delete('/:id', use(bookingController.delete));

module.exports = router;
