const cryptoUtil = require("../utils/crypto.js");
const nodemailer = require("../utils/nodemailer.js");
const httpUtil = require('../utils/httpUtil.js');


function validate(body, res) {
    if (!body.email) {
      res.send(httpUtil.createResponse(400, "ERROR : Missing email."));
      return false;
    }
    if (!body._id) {
        res.send(httpUtil.createResponse(400, "ERROR : Missing _id."));
        return false;
      }
    return true;
  }

module.exports.handler = function(req, res) {
    console.log("Starting function changeEmailInit...");
    console.log(req.body);
  
    if (req.body === null || !validate(req.body, res)) {
      return;
    }

    let email = req.body.email;
    let id = req.body._id;

    let newEmailHash = cryptoUtil.hashEncrypt(id);
    
    nodemailer.changeEmail(email, newEmailHash);
    return res.send(httpUtil.createResponse(200, "SUCCESS : change email email sent."));
}