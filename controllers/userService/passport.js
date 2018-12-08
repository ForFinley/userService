const jwt = require("jsonwebtoken");
const cryptoUtil = require("../utils/crypto.js");
const database = require("../utils/mongoUser.js");
const secret = require("../utils/keys/privateKey.js");
const TOKENTIME = 120 * 60; // in seconds

/**
 * Passport stuff, these four functions
 */
async function passportStrategy(username, password, done) {
  username = username.trim().toLowerCase();
  let user = await database.queryUserByusername(username);
  console.log(user);
  if (user) {
    if (cryptoUtil.checkPassword(password, user.password, user.salt))
      done(null, user);
  }
  done(null, false);
}

async function serialize(req, res, next) {
  req.user = {
    _id: req.user._id,
    username: req.user.username,
    emailVerified: req.user.emailVerified
  };
  console.log("USER", req.user);
  next(null, req.user);
}

function generateToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified
    },
    secret.key,
    {
      expiresIn: TOKENTIME
    }
  );
}

module.exports = {
  passportStrategy,
  serialize,
  generateToken
};
