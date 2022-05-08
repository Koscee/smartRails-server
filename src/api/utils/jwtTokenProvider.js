const jwt = require('jsonwebtoken');
const { SECURITY_CONSTANTS } = require('../constants');

const { EXPIRATION_TIME } = SECURITY_CONSTANTS;

module.exports = {
  generateToken: function (payload) {
    // create token using the payload
    const token = jwt.sign(payload, process.env.JWTSECRET, {
      expiresIn: EXPIRATION_TIME,
    });
    return token;
  },

  // verifies a token
  verifyToken: function (token) {
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);
    return decodedToken;
  },
};
