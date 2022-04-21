module.exports = {
  /**
   * capitalize the first letter of a string and converts the rest to lowercase
   * @param {string} val
   * @returns string
   */
  capitalizeFirstLetter: function (val) {
    let value = val;
    if (typeof value !== 'string') value = '';
    return value.charAt(0).toUpperCase() + value.substring(1).toLowerCase();
  },

  /**
   * remove spaces, numbers and non-alphabetical characters from a string
   * @param {string} textString
   * @returns string
   */
  removeSpacesNumsAndSymbols: function (textString) {
    return textString && textString.replace(/\s|([^A-Za-z])/g, '');
  },

  /**
   * remove spaces, and non-alphabetical characters from a string
   * @param {string} textString
   * @returns string
   */
  removeSpacesAndSymbols: function (textString) {
    return textString && textString.replace(/\s|([^A-Za-z0-9])/g, '');
  },

  /**
   * remove only spaces from a string
   * @param {string} textString
   * @returns string
   */
  removeSpaces: function (textString) {
    return textString && textString.replace(/\s/g, '');
  },

  /**
   * remove numbers and non-alphabetical characters from a string
   * @param {string} textString
   * @returns string
   */
  removeNumsAndSymbols: function (textString) {
    return textString && textString.replace(/([^A-Za-z])/g, '');
  },
};
