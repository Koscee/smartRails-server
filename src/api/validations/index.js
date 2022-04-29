const { removeSpaces } = require('../utils/formatString');

module.exports = {
  checkFieldBlank: function (value) {
    return removeSpaces(value) !== '';
  },
};
