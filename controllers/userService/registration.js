const httpUtil = require('../utils/httpUtil.js');
const database = require('../mongo/mongo.js');
const cryptoUtil = require('../crypto/index.js');
const nodemailer = require('../nodemailer/nodemailer.js');

function validate(body, res) {

    if (!body.username) {
        res.send(httpUtil.createResponse(400, "**ERROR** : MISSING_USERNAME"));
        return false;
    }
    if (!body.password) {
        res.send(httpUtil.createResponse(400, "**ERROR** : MISSING_PASSWORD"));
        return false;
    }
    return true;
}

/**
 * Adds user to database
 * @param {*} req 
 * @param {*} res 
 */
module.exports.handler = async function (req, res) {
    console.log("Starting function registration...");
    console.log(req.body);

    if (req.body === null || !validate(req.body, res)) {
        return;
    }

    let username = req.body.username;
    let password = req.body.password;
    username = username.trim().toLowerCase();

    let passwordResult = cryptoUtil.encryptPassword(password);
    let emailHash = cryptoUtil.emailHashEncrypt(username);
    let user = await database.queryUserByusername(username);
    if (user) return res.send(httpUtil.createResponse(400, "**ERROR** - username in use."));
    else {
        let user = {
            username: username,
            email: username,
            password: passwordResult.encryptPass,
            salt: passwordResult.salt,
            emailVerified: false,
            emailVerificationHash: emailHash
        }
        console.log("USER: ", user);
        database.putUser(user);
        nodemailer.sendEmailVerification(username, emailHash);
        return res.send(httpUtil.createResponse(200, "User added."));
    }
}