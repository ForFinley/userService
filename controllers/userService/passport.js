const cryptoUtil = require("../utils/crypto.js");
const database = require("../utils/mongoUser.js");

async function passportStrategy(username, password, done) {
  username = username.trim().toLowerCase();
  let user = await database.queryUserByusername(username);
  if (user) {
    if (cryptoUtil.checkPassword(password, user.password, user.salt))
      done(null, user);
  }
  done(null, false);
}

module.exports = {
  passportStrategy
};
