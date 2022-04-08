const router = require('express').Router();
const { cityController } = require('../controllers');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * An Endpoint to fetch all the lists of routes
 * @route /api/cities
 * @access public
 */
router.get('/', use(cityController.getAll));

module.exports = router;
