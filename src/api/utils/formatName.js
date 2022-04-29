const {
  removeSpacesNumsAndSymbols,
  capitalizeFirstLetter,
} = require('./formatString');

function formatName(value) {
  let name = value;
  name = removeSpacesNumsAndSymbols(name);
  name = capitalizeFirstLetter(name);
  return name;
}

module.exports = formatName;
