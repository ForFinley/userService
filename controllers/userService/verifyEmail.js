const cryptoUtil = require('../utils/crypto.js');
const httpUtil = require('../utils/httpUtil.js');
const database = require('../utils/mongoUser.js');

function validate(params, res) {
    
    if (!params.emailHash) {
        res.send(httpUtil.createResponse(400, "**ERROR** : MISSING_EMAIL_HASH"));
        return false;
    }

    return true;
}

/**
 * Changes emailVerified field to true
 * @param {*} req 
 * @param {*} res 
 */
module.exports.handler = async function (req, res) {
    console.log("Starting function verifyEmail...");
    console.log(req.params);

    if (req.body === null || !validate(req.params, res)) {
        return;
    }

    let emailHash = req.params.emailHash;

    let username = cryptoUtil.emailHashDecrypt(emailHash);
    let result = await database.updateUser(username, { emailVerified: true });
    console.log(result);
    res.send(httpUtil.createResponse(200, "Email verified."));
}