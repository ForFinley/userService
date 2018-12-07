const httpUtil = require("../utils/httpUtil.js");
const database = require("../utils/mongoUser.js");
const cryptoUtil = require("../utils/crypto.js");
const nodemailer = require("../utils/nodemailer.js");

function validate(body, res) {
  if (!body.username) {
    res.send(httpUtil.createResponse(400, "ERROR : Missing username."));
    return false;
  }
  if (!body.password) {
    res.send(httpUtil.createResponse(400, "ERROR : Missing password."));
    return false;
  }
  return true;
}

/**
 * Adds user to database
 * @param {*} req
 * @param {*} res
 */
module.exports.handler = async function(req, res) {
  console.log("Starting function registration...");
  console.log(req.body);

  if (req.body === null || !validate(req.body, res)) {
    return;
  }

  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  username = username.trim().toLowerCase();

  let passwordResult = cryptoUtil.encryptPassword(password);
  let emailHash = cryptoUtil.emailHashEncrypt(username);
  let user = await database.queryUserByusername(username);
  if (user)
    return res.send(httpUtil.createResponse(400, "ERROR - username in use."));
  else {
    let user = {
      username: username,
      email: email,
      password: passwordResult.encryptPass,
      salt: passwordResult.salt,
      emailVerified: false,
      emailVerificationHash: emailHash
    };
    console.log("USER: ", user);
    database.putUser(user);
    nodemailer.sendEmailVerification(email, emailHash);
    return res.send(httpUtil.createResponse(200, "SUCCESS : User added."));
  }
};
