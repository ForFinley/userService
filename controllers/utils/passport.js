const cryptoUtil = require("./crypto.js");
const database = require("./mongoUser.js");

async function passportStrategy(email, password, done) {
  email = email.trim().toLowerCase();
  try {
    var user = await database.queryUserByEmail(email);
  } catch (e) {
    console.log("**ERROR** ", e);
    return;
  }
  if (user) {
    if (cryptoUtil.checkPassword(password, user.password, user.salt))
      done(null, user);
  }
  done(null, false);
}

module.exports = {
  passportStrategy
};
