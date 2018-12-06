const jwt = require('jsonwebtoken');
<<<<<<< HEAD
const cryptoUtil = require('../utils/cryptoUtil.js');
const httpUtil = require('../utils/httpUtil.js');
const database = require('./mongo.js');
const nodeMailer = require('./nodemailer.js')
const secret = require('../utils/keys/privateKey.js');
=======
const passwordUtil = require('../utils/passwordUtil');
const httpUtil = require('../utils/httpUtil');
const database = require('./mongo.js');
const secret = require('../utils/keys/privateKey');
>>>>>>> 2c34576b9f725d7aa696e8ae492017225b0d9953
const TOKENTIME = 120 * 60; // in seconds

/**
 * Passport stuff, these four functions
 */
async function passportStrategy(username, password, done) {
    username = username.trim().toLowerCase();
    let user = await database.queryUserByusername(username);
    console.log(user)
    if (user) {
<<<<<<< HEAD
        if (cryptoUtil.checkPassword(password, user.password, user.salt)) done(null, user);
=======
        if (passwordUtil.checkPassword(password, user.password, user.salt)) done(null, user);
>>>>>>> 2c34576b9f725d7aa696e8ae492017225b0d9953
    }
    done(null, false);
}

async function serialize(req, res, next) {
    req.user = {
        id: req.user._id,
        username: req.user.username
    };
    next(null, req.user);
}

function generateToken(req, res, next) {
    req.token = jwt.sign({
        id: req.user._id,
        username: req.user.username
    }, secret.key, {
            expiresIn: TOKENTIME
        });
    next();
}

function respond(req, res) {
    res.status(200).json({
        user: req.user,
        token: req.token
    });
}
<<<<<<< HEAD

=======
>>>>>>> 2c34576b9f725d7aa696e8ae492017225b0d9953
/**
 * Adds user to database
 * @param {*} req 
 * @param {*} res 
 */
async function registration(req, res) {
    console.log("Starting function registration...");
    console.log(req.body);
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
<<<<<<< HEAD
        let passwordResult = cryptoUtil.encryptPassword(password);
        let emailHash = cryptoUtil.emailHashEncrypt(username);
=======
        let passwordResult = passwordUtil.encryptPassword(password);
>>>>>>> 2c34576b9f725d7aa696e8ae492017225b0d9953
        username = username.trim().toLowerCase();
        let user = await database.queryUserByusername(username);
        if (user) return res.send(httpUtil.createResponse(400, "**ERROR** - username in use."));
        else {
            let user = {
                username: username,
                email: username,
                password: passwordResult.encryptPass,
                salt: passwordResult.salt,
<<<<<<< HEAD
                emailVerified: false,
                emailVerificationHash: emailHash
            }
            console.log("USER: ", user)
            database.putUser(user);
            nodeMailer.sendEmailVerification(username, emailHash);
=======
                emailVerified: false
            }
            console.log("USER: ", user)
            database.putUser(user);
>>>>>>> 2c34576b9f725d7aa696e8ae492017225b0d9953
            return res.send(httpUtil.createResponse(200, "User added."));
        }
    }
    else {
        console.log("**ERROR** - Not all data present.");
        return res.send(httpUtil.createResponse(400, "**ERROR** - Not all data present."));
    }
}

/**
 * Changes password in database
 * @param {*} req 
 * @param {*} res 
 */
async function changePassword(req, res) {
    console.log("Starting function changePassword...");
    let username = req.body.username;
    username = username.trim().toLowerCase();
    let password = req.body.password;
    let newPassword = req.body.newPassword;

    let usernameBool = true; //Checks to see if username is in database 
    let user = await database.queryUserByusername(username);

    if (user) {
        usernameBool = false;
<<<<<<< HEAD
        if (cryptoUtil.checkPassword(password, user.password, user.salt)) {
            let passwordResult = cryptoUtil.encryptPassword(newPassword);
=======
        if (passwordUtil.checkPassword(password, user.password, user.salt)) {
            let passwordResult = passwordUtil.encryptPassword(newPassword);
>>>>>>> 2c34576b9f725d7aa696e8ae492017225b0d9953
            user.password = passwordResult.encryptPass;
            user.salt = passwordResult.salt;

            database.putUser(user);
            return res.send(httpUtil.createResponse(200, "Password changed."));
        }
        else {
            console.log("Password incorrect.")
            return res.send(httpUtil.createResponse(200, "username or password invalid."));
        }
    }
    if (usernameBool) {
        console.log("username does not exist.");
        return res.send(httpUtil.createResponse(200, "username or password invalid."));
    }
}

/**
 * Changes emailVerified field to true
 * @param {*} req 
 * @param {*} res 
 */
<<<<<<< HEAD
async function verifyEmail(req, res) {
    let emailHash = req.params.emailHash;
    if (emailHash) {
        let username = cryptoUtil.emailHashDecrypt(emailHash);
        let result = await database.updateUser(username, { emailVerified: true });
        console.log(result);
        res.send(httpUtil.createResponse(200, "Email verified."));
    }
    else res.send(httpUtil.createResponse(400, "No hash."));
=======
async function verifyEmail(req, res){
    let userId = req.body.id;
    let result = await database.updateUser(userId, {emailVerified: true});
    console.log(result);
    res.send(httpUtil.createResponse(200, "Email verified."));
>>>>>>> 2c34576b9f725d7aa696e8ae492017225b0d9953
}

module.exports = {
    passportStrategy,
    registration,
    serialize,
    generateToken,
    respond,
    changePassword,
    verifyEmail
}

