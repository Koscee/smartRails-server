const { removeSpaces } = require('../utils/formatString');

module.exports = {
  checkFieldBlank: function (value) {
    return removeSpaces(value) !== '';
  },

  checkEmailValid: function (value) {
    return /^[\w-.]+@([\w-]+\.)+([a-zA-Z]([\w]){1,5})$/g.test(value);
  },
};
