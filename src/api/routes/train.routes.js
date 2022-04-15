const router = require('express').Router();
const { trainController } = require('../controllers');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * An Endpoint to create a new train
 * @route /api/trains
 * @access private
 */
router.post('/', use(trainController.create));

/**
 * An Endpoint to fetch all the lists of trains
 * @route /api/trains
 * @access public
 */
router.get('/', use(trainController.getAll));

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
router.put('/:id', use(trainController.update));

/**
 * An Endpoint to delete a particular train by id
 * @route /api/trains/:id
 * @access private
 */
router.delete('/:id', use(trainController.delete));

module.exports = router;
