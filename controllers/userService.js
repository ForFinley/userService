const uuidv1 = require('uuid/v1');
const jwt = require('jsonwebtoken');
const database = require('../db');
const passwordUtil = require('../utils/passwordUtil');
const httpUtil = require('../utils/httpUtil');
const secret = require('../utils/keys/privateKey');
const TOKENTIME = 120 * 60; // in seconds

//passport config
async function passportStrategy(email, password, done) {
    email = email.trim().toLowerCase();
    let user = await database.query("users", "email", email);
    if (user.Count > 0) {
        if (passwordUtil.checkPassword(password, user.Items[0].password, user.Items[0].salt)) done(null, user.Items[0]);
    }
    done(null, false);
}

async function registration(req, res) {
    console.log("Starting function registration...");
    let email = req.body.email;
    let password = req.body.password;

    if (email && password) {
        let id = uuidv1();
        let passwordResult = passwordUtil.encryptPassword(password);
        email = email.trim().toLowerCase();
        //Checks to see if email is already in use.
        let user = await database.query("users", "email", email);
        if (user.Count > 0) res.send(httpUtil.createResponse(400, "**ERROR** - Email in use."));

        else {
            let user = {
                id: id,
                email: email,
                password: passwordResult.encryptPass,
                salt: passwordResult.salt
            }
            database.write("users", user);
            res.send(httpUtil.createResponse(200, "User added."));
        }
    }
    else {
        console.log("**ERROR** - Not all data present.");
        res.send(httpUtil.createResponse(400, "**ERROR** - Not all data present."));
    }
}

//What fields are returned
async function serialize(req, res, next) {
    req.user = {
        id: req.user.id,
        email: req.user.email
    };
    next(null, req.user);
}

function generateToken(req, res, next) {
    req.token = jwt.sign({
        id: req.user.id,
        email: req.user.email
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

async function changePassword(req, res) {
    console.log("Starting function changePassword...");
    let email = req.body.email;
    let password = req.body.password;
    let newPassword = req.body.newPassword;

    email = email.trim().toLowerCase();
    let emailBool = true; //Checks to see if email is in database 
    let user = await database.query('users', "email", email);

    if (user.Count > 0) {
        emailBool = false;
        if (passwordUtil.checkPassword(password, user.Items[0].password, user.Items[0].salt)) {
            let passwordResult = passwordUtil.encryptPassword(newPassword);
            user.Items[0].password = passwordResult.encryptPass;
            user.Items[0].salt = passwordResult.salt;

            database.write("users", user.Items[0]);
            res.send(httpUtil.createResponse(200, "Password changed."));
        }
        else {
            console.log("Password incorrect.")
            res.send(httpUtil.createResponse(200, "Email or password invalid."));
        }
    }
    if (emailBool) {
        console.log("Email does not exist.");
        res.send(httpUtil.createResponse(200, "Email or password invalid."));
    }
}

module.exports = {
    passportStrategy,
    registration,
    serialize,
    generateToken,
    respond,
    changePassword
}

