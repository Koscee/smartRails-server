const router = require('express').Router();
const { testController } = require('../controllers');

router.get('/', testController.getText);

module.exports = router;
