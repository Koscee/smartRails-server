const router = require('express').Router();
const { passengerController } = require('../controllers');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * An Endpoint to create a new passenger
 * @route /api/passengers
 * @access private
 */
router.post('/', use(passengerController.create));

/**
 * An Endpoint to fetch all the lists of passengers
 * @route /api/passengers
 * @access public
 */
router.get('/', use(passengerController.getAll));

/**
 * An Endpoint to fetch a particular passenger by id
 * @route /api/passengers/:id
 * @access public
 */
router.get('/:id', use(passengerController.getById));

/**
 * An Endpoint to update a particular passenger by id
 * @route /api/passengers/:id
 * @access private
 */
router.put('/:id', use(passengerController.update));

/**
 * An Endpoint to delete a particular passenger by id
 * @route /api/passengers/:id
 * @access private
 */
router.delete('/:id', use(passengerController.delete));

module.exports = router;
