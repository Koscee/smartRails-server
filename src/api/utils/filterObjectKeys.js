function filterObjectKeys(object, keysToRemove) {
  keysToRemove.forEach((key) => delete object[key]);

  return object;
}

module.exports = filterObjectKeys;
