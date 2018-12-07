const cryptoUtil = require('../utils/crypto.js');
const httpUtil = require('../utils/httpUtil.js');
const database = require('../utils/mongoUser.js');

function validate(body, res) {

    if (!body.username) {
        res.send(httpUtil.createResponse(400, "ERROR : Missing username."));
        return false;
    }
    if (!body.password) {
        res.send(httpUtil.createResponse(400, "ERROR : Missing password."));
        return false;
    }
    if (!body.newPassword) {
        res.send(httpUtil.createResponse(400, "ERROR : Missing newPassword."));
        return false;
    }
    return true;
}

/**
 * Changes password in database
 * @param {*} req 
 * @param {*} res 
 */
module.exports.handler = async function (req, res) {
    console.log("Starting function changePassword...");
    console.log(req.body);

    if (req.body === null || !validate(req.body, res)) {
        return;
    }

    let username = req.body.username;
    let password = req.body.password;
    let newPassword = req.body.newPassword;
    username = username.trim().toLowerCase();

    let usernameBool = true; //Checks to see if username is in database 
    let user = await database.queryUserByusername(username);

    if (user) {
        usernameBool = false;
        if (cryptoUtil.checkPassword(password, user.password, user.salt)) {
            let passwordResult = cryptoUtil.encryptPassword(newPassword);
            user.password = passwordResult.encryptPass;
            user.salt = passwordResult.salt;

            database.putUser(user);
            return res.send(httpUtil.createResponse(200, "SUCCESS : Password changed."));
        }
        else {
            console.log("Password incorrect.")
            return res.send(httpUtil.createResponse(401, "ERROR : username or password invalid."));
        }
    }
    if (usernameBool) {
        console.log("username does not exist.");
        return res.send(httpUtil.createResponse(401, "ERROR : username or password invalid."));
    }
}
