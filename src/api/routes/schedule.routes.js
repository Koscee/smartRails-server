const router = require('express').Router();
const { scheduleController } = require('../controllers');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * An Endpoint to create a new schedule
 * @route /api/trains/schedules
 * @access private
 */
router.post('/', use(scheduleController.create));

/**
 * An Endpoint to fetch all the lists of schedules
 * @route /api/trains/schedules
 * @access public
 */
router.get('/', use(scheduleController.getAll));

/**
 * An Endpoint to fetch a particular schedule by id
 * @route /api/trains/schedules/:id
 * @access public
 */
router.get('/:id', use(scheduleController.getById));

/**
 * An Endpoint to update a particular schedule by id
 * @route /api/trains/schedules
 * @access private
 */
router.put('/', use(scheduleController.update));

/**
 * An Endpoint to delete a particular schedule by id
 * @route /api/trains/schedules/:trainNo
 * @access private
 */
router.delete('/:trainNo', use(scheduleController.delete));

module.exports = router;
