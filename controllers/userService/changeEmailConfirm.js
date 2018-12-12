const cryptoUtil = require("../utils/crypto.js");
const httpUtil = require('../utils/httpUtil.js');
const database = require('../utils/mongoUser.js');
const nodemailer = require("../utils/nodemailer.js");

function validate(body, res) {
    
    if (!body.changeEmailHash) {
        res.send(httpUtil.createResponse(400, "ERROR : Missing changeEmailHash."));
        return false;
    }
    if (!body.email) {
        res.send(httpUtil.createResponse(400, "ERROR : Missing email."));
        return false;
    }

    return true;
}

module.exports.handler = async function(req, res) {
    console.log("Starting function changeEmailConfirm...");
    console.log(req.body);

    if (req.body === null || !validate(req.body, res)) {
        return;
    }

    let hash = req.body.changeEmailHash;
    let email = req.body.email;

    let id = cryptoUtil.hashDecrypt(hash);
    let result = await database.updateUserById(id, {email: email, emailVerified: false});
    console.log(result);

    let emailHash = cryptoUtil.hashEncrypt(email);
    nodemailer.sendEmailVerification(email, emailHash);

    res.send(httpUtil.createResponse(200, "SUCCESS : New email updated."));
};