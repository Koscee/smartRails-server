const router = require('express').Router();
const { seatController } = require('../controllers');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * An Endpoint to fetch all the lists of seats of trains
 * @route /api/trains/seats   (?train_no=<value>&car_no=<value>&sno=<value>)
 * @access public
 */
router.get('/', use(seatController.getAll));

module.exports = router;
