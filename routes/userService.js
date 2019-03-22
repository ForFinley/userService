const express = require('express');
const router = express.Router();
const { authenticate } = require('../controllers/utils/jwt.js');
const addFullUser = require('../controllers/utils/addFullUser.js');

const registration = require('../controllers/userService/registration.js');
const signIn = require('../controllers/userService/signIn.js');
const changePassword = require('../controllers/userService/changePassword.js');
const verifyEmail = require('../controllers/userService/verifyEmail.js');
const passwordReset = require('../controllers/userService/passwordReset.js');
const changeEmail = require('../controllers/userService/changeEmail.js');

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
 *
 * Google SignIn
 * Headers: Authorization: google token (googleUser.getAuthResponse().id_token)
 * Body: provider:google
 */
router.post('/signIn', signIn.handler);

/**
 * /userService/changePassword
 * Headers: content-type: application/json, authorization: Bearer <Token>
 * Body: password(current), newPassword
 * Will save new password to DB
 */
router.post('/changePassword', authenticate, changePassword.handler);

/**
 * /userService/verifyEmail/<emailHash>
 * Headers: content-type: application/json
 * Changes record in DB to emailVerified: true
 */
router.get('/verifyEmail/:emailHash', verifyEmail.handler);

/**
 * TEST
 * userService/me
 * Headers: authorization: Bearer <Token>
 */
router.get('/me', authenticate, addFullUser, function(req, res) {
  delete req.user.password;
  delete req.user.salt;
  delete req.user.stripeCustomerId;
  res.status(200).json(req.user);
});

// /**
//  * userService/passwordResetInit
//  * Headers: content-type: application/json
//  * Body: email
//  * Sends reset password email.
//  */

// /**
//  * userService/passwordResetConfirm
//  * Headers: content-type: application/json
//  * Body: passwordResetHash, password(new password)
//  * Sets new password.
//  */
router.post('/passwordReset', passwordReset.handler);

/**
 * userService/changeEmailInit
 * Headers: content-type: application/json, authorization: Bearer <Token>
 * Body: email
 * Sends change email email.
 */
/**
 * userService/changeEmailConfirm
 * Headers: content-type: application/json
 * Body: changeEmailHash, email(new email)
 * Changes email.
 */
router.post('/changeEmail', changeEmail.handler);

module.exports = router;
