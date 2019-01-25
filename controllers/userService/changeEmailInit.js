const cryptoUtil = require("../utils/crypto.js");
const nodemailer = require("../utils/nodemailer.js");
const httpUtil = require('../utils/httpUtil.js');


function validate(body, res) {
  if (!body.email) {
    res.status(400).send(httpUtil.createResponse(400, "ERROR : Missing email."));
    return false;
  }
  return true;
}

module.exports.handler = function (req, res) {
  console.log("Starting function changeEmailInit...");
  console.log(req.body);

  if (req.body === null || !validate(req.body, res)) {
    return;
  }

  let email = req.body.email;
  let userId = req.user.userId;

  let newEmailHash = cryptoUtil.hashEncrypt(userId);

  nodemailer.changeEmail(email, newEmailHash);
  return res.status(200).send(httpUtil.createResponse(200, "SUCCESS : change email email sent."));
}
