const express = require('express');
const router = express.Router();
const passport = require('passport');
const expressJwt = require('express-jwt');
const secret = require('../controllers/utils/keys/privateKey');
const authenticate = expressJwt({ secret: secret.key });

const registration = require("../controllers/userService/registration.js");
const passportFunctions = require('../controllers/userService/passport.js');
const changePassword = require("../controllers/userService/changePassword.js");
const verifyEmail = require("../controllers/userService/verifyEmail.js");

/** 
 * /userService/registration
 * Body: email, password
 * Adds user to DB
 */
router.post('/registration', registration.handler);

/** 
 * /userService/signIn
 * Body: email, password
 * Returns Bearer authorization token
 */
router.post('/signIn', passport.initialize(), passport.authenticate(
    'local', {
        session: false,
        scope: []
    }), passportFunctions.serialize, passportFunctions.generateToken, passportFunctions.respond);

/**
 * /userService/changePassword
 * Headers: content-type: application/json, authorization: Bearer <Token>
 * Body: email, password(current), newPassword
 * Will save new password to DB
 */
router.post('/changePassword', authenticate, changePassword.handler);

/**
 * /userService/verifyEmail/<emailHash>
 * Headers: content-type: application/json
 * Body: emailHash
 * Changes record in DB to emailVerified: true
 */
router.get('/verifyEmail/:emailHash', verifyEmail.handler);

/**
 * userService/me
 * Headers: authorization: Bearer <Token>
 */
router.get('/me', authenticate, function (req, res) {
    res.status(200).json(req.user);
});

module.exports = router;