const express = require('express');
const router = express.Router();
const { authenticate } = require('../controllers/utils/jwt');
const registration = require('../controllers/registration');
const signIn = require('../controllers/signIn');
const changePassword = require('../controllers/changePassword');
const verifyEmail = require('../controllers/verifyEmail');
const passwordReset = require('../controllers/passwordReset');
const changeEmail = require('../controllers/changeEmail');
const refresh = require('../controllers/refresh');
const signOut = require('../controllers/signOut');

/**
 * /userService/registration
 * Body: email, password
 * Adds user to DB
 */
router.post('/registration', registration.handler);

/**
 * /userService/signIn
 * This user service sign in
 * Body: email, password
 *
 * Google SignIn
 * Headers: authorization: google token (googleUser.getAuthResponse().id_token)
 * Body: provider:google
 *
 * Returns authorization token and refresh token
 */
router.post('/signIn', signIn.handler);

/**
 * /userService/changePassword
 * Headers: content-type: application/json, authorization: <authorizationToken>
 * Body: password(current), newPassword
 * Will save new password to DB
 */
router.post('/changePassword', authenticate, changePassword.handler);

/**
 * /userService/verifyEmail/<emailHash>
 * Changes record in DB to emailVerified: true
 */
router.get('/verifyEmail/:emailHash', verifyEmail.handler);

/**
 * userService/passwordReset
 *
 * Initalize
 * Body: email
 * Sends reset password email.
 *
 * Confirm
 * Headers: content-type: application/json
 * Body: passwordResetHash, password(new password)
 * Sets new password.
 */
router.post('/passwordReset', passwordReset.handler);

/**
 * userService/changeEmail
 *
 * Initalize
 * Headers: content-type: application/json, authorization: <authorizationToken>
 * Sends change email email.
 */
/**
 * userService/changeEmailConfirm
 * Headers: content-type: application/json
 * Body: changeEmailHash, email(new email)
 * Changes email.
 */
router.post('/changeEmail', changeEmail.handler);

/**
 * userService/refresh
 * Headers: content-type: application/json, authorization: <refreshToken>
 * refreshes authorization token
 */
router.get('/refresh', refresh.handler);

/**
 * userService/signOut
 * Headers: content-type: application/json, authorization: <refreshToken>
 * Deletes refresh token for current session
 */
router.get('/signOut', signOut.handler);

/**
 * userService/docs
 * Returns json file with swagger docs
 */
router.get('/docs', (req, res) => {
  const docs = require('../docs.json');
  return res.status(200).send(docs);
});

/**
 * userService/healthCheck
 */
router.get('/healthCheck', (req, res) => {
  return res.status(200).send('HEALTHY');
});

module.exports = router;
