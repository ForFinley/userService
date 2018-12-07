const jwt = require('jsonwebtoken');
const cryptoUtil = require('../utils/crypto.js');
const database = require('../utils/mongoUser.js');
const secret = require('../utils/keys/privateKey.js');
const TOKENTIME = 120 * 60; // in seconds

/**
 * Passport stuff, these four functions
 */
async function passportStrategy(username, password, done) {
    username = username.trim().toLowerCase();
    let user = await database.queryUserByusername(username);
    console.log(user)
    if (user) {
        if (cryptoUtil.checkPassword(password, user.password, user.salt)) done(null, user);
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

module.exports = {
    passportStrategy,
    serialize,
    generateToken,
    respond
}