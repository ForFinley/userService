const express = require('express');
const router = express.Router();
const passport = require('passport');
const expressJwt = require('express-jwt');
const secret = require('../utils/keys/privateKey');
const authenticate = expressJwt({secret: secret.key});
const userServiceController = require('../controllers/userService');
  
/** 
 * /userService/registration
 * Body: email, password
 * Adds user to DB
 */
router.post('/registration', userServiceController.registration);

/** 
 * /userService/signIn
 * Body: email, password
 * Returns Bearer authorization token
 */
router.post('/signIn', passport.initialize(), passport.authenticate(
    'local', {
        session: false,
        scope: []
    }), userServiceController.serialize, userServiceController.generateToken, userServiceController.respond);

/**
 * /userService/changePassword
 * Headers: content-type: application/json, authorization: Bearer <Token>
 * Body: email, password(current), newPassword
 * Will save new password to DB
 */
router.post('/changePassword', authenticate, userServiceController.changePassword);

/**
 * /userService/verifyEmail
 * Headers: content-type: application/json, authorization: Bearer <Token>
 * Body: id(_id from mongodb)
 * Changes record in DB to emailVerified: true
 */
router.post('/verifyEmail', authenticate, userServiceController.verifyEmail);

/**
 * userService/me
 * Headers: authorization: Bearer <Token>
 */
router.get('/me', authenticate, function (req, res) {
    res.status(200).json(req.user);
});

module.exports = router;