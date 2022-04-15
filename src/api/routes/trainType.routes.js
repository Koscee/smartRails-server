const router = require('express').Router();
const { trainTypeController } = require('../controllers');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * An Endpoint to create a new train type
 * @route /api/trains/types
 * @access private
 */
router.post('/', use(trainTypeController.create));

/**
 * An Endpoint to fetch all the lists of trainTypes
 * @route /api/trains/types
 * @access public
 */
router.get('/', use(trainTypeController.getAll));

/**
 * An Endpoint to fetch a particular trainType by id
 * @route /api/trains/types/:id
 * @access public
 */
router.get('/:id', use(trainTypeController.getById));

/**
 * An Endpoint to update a particular trainType by id
 * @route /api/trains/types/:id
 * @access private
 */
router.put('/:id', use(trainTypeController.update));

/**
 * An Endpoint to delete a particular trainType by id
 * @route /api/trains/types/:id
 * @access private
 */
router.delete('/:id', use(trainTypeController.delete));

module.exports = router;
