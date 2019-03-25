const express = require('express');
const router = express.Router();
const { authenticate } = require('../controllers/utils/jwt.js');

const registration = require('../controllers/registration.js');
const signIn = require('../controllers/signIn.js');
const changePassword = require('../controllers/changePassword.js');
const verifyEmail = require('../controllers/verifyEmail.js');
const profile = require('../controllers/profile.js');
const passwordReset = require('../controllers/passwordReset.js');
const changeEmail = require('../controllers/changeEmail.js');

/**
 * /userService/registration
 * Body: email, password
 * Adds user to DB
 */
router.post('/registration', registration.handler);

/**
 * /userService/signIn
 * Body: email, password
 * Returns authorization token
 *
 * Google SignIn
 * Headers: Authorization: google token (googleUser.getAuthResponse().id_token)
 * Body: provider:google
 */
router.post('/signIn', signIn.handler);

/**
 * /userService/changePassword
 * Headers: content-type: application/json, authorization: <Token>
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
 * userService/profile
 * Headers: authorization: <Token>
 * Returns all user info needed
 */
router.get('/profile', authenticate, profile.handler);

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
 * Headers: content-type: application/json, authorization: <Token>
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
