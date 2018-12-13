const cryptoUtil = require('../utils/crypto.js');
const httpUtil = require('../utils/httpUtil.js');
const database = require('../utils/mongoUser.js');

function validate(body, res) {

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

    let id = req.user._id;
    let password = req.body.password;
    let newPassword = req.body.newPassword;

    let idBool = true; //Checks to see if emnail is in database
    let user = await database.queryUserById(id);

    if (user) {
        idBool = false;
        if (cryptoUtil.checkPassword(password, user.password, user.salt)) {
            let passwordResult = cryptoUtil.encryptPassword(newPassword);
            user.password = passwordResult.encryptPass;
            user.salt = passwordResult.salt;

            database.putUser(user);
            return res.send(httpUtil.createResponse(200, "SUCCESS : Password changed."));
        }
        else {
            console.log("Password incorrect.")
            return res.send(httpUtil.createResponse(401, "ERROR : email or password invalid."));
        }
    }
    if (idBool) {
        console.log("email does not exist.");
        return res.send(httpUtil.createResponse(401, "ERROR : email or password invalid."));
    }
}
