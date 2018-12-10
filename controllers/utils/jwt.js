const jwt = require("jsonwebtoken");
const secret = require("../utils/keys/privateKey.js");
const TOKENTIME = 120 * 60; // in seconds

function generateToken(user) {
    return jwt.sign(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      secret.key,
      {
        expiresIn: TOKENTIME
      }
    );
  }

  module.exports = {
    generateToken
  };