const { testService } = require('../services');

module.exports = {
  getText: function (req, res) {
    const greeting = testService.greetUser();
    res.send(greeting);
  },
};
