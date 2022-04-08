const router = require('express').Router();
const { routeController } = require('../controllers');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * An Endpoint to create a new route
 * @route /api/trains/routes
 * @access private
 */
router.post('/', use(routeController.create));

/**
 * An Endpoint to fetch all the lists of routes
 * @route /api/trains/routes
 * @access private
 */
router.get('/', use(routeController.getAll));

/**
 * An Endpoint to fetch a particular route by id
 * @route /api/trains/routes/:id
 * @access private
 */
router.get('/:id', use(routeController.getById));

/**
 * An Endpoint to update a particular route by id
 * @route /api/trains/routes/:id
 * @access private
 */
router.put('/:id', use(routeController.update));

/**
 * An Endpoint to delete a particular route by id
 * @route /api/trains/routes/:id
 * @access private
 */
router.delete('/:id', use(routeController.delete));

module.exports = router;
