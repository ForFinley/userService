const cryptoUtil = require("../utils/crypto.js");
const httpUtil = require('../utils/httpUtil.js');
const database = require('../utils/mongoUser.js');

function validate(body, res) {

    if (!body.passwordResetHash) {
        res.status(400).send(httpUtil.createResponse(400, "ERROR : Missing passwordResetHash."));
        return false;
    }
    if (!body.password) {
        res.status(400).send(httpUtil.createResponse(400, "ERROR : Missing password."));
        return false;
    }

    return true;
}

module.exports.handler = async function (req, res) {
    console.log("Starting function passwordResetConfirm...");
    console.log(req.body);

    if (req.body === null || !validate(req.body, res)) {
        return;
    }

    let hash = req.body.passwordResetHash;
    let password = req.body.password;

    let email = cryptoUtil.hashDecrypt(hash); //passwordResetHash contains email

    let passwordResult = cryptoUtil.encryptPassword(password);

    try {
        let result = await database.updateUserByEmail(email, { password: passwordResult.encryptPass, salt: passwordResult.salt });
        console.log(result);
        res.send(httpUtil.createResponse(200, "SUCCESS : Password reset."));
    }
    catch (e) {
        console.log('**ERROR** ', e);
        return res.status(500).send(httpUtil.createResponse(500, "Internal Server Error."));
    }
};