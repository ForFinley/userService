const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authenticate');
const registration = require('../controllers/registration');
const signIn = require('../controllers/signIn');
const changePassword = require('../controllers/changePassword');
const verifyEmail = require('../controllers/verifyEmail');
const passwordResetInit = require('../controllers/passwordReset/passwordResetInit');
const passwordResetConfirm = require('../controllers/passwordReset/passwordResetConfirm');
const changeEmailInit = require('../controllers/changeEmailInit');
const changeEmailConfirm = require('../controllers/changeEmailConfirm');
const refresh = require('../controllers/refresh');
const signOut = require('../controllers/signOut');

/**
 * /identity-service/registration
 * Headers: content-type: application/json
 * Body: email, password, emailBool
 * Adds user to DB
 */
router.post('/registration', registration.handler);

/**
 * /identity-service/signIn
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
 * /identity-service/changePassword
 * Headers: content-type: application/json, authorization: <authorization>
 * Body: password(current), newPassword
 * Will save new password to DB
 */
router.post('/changePassword', authenticate, changePassword.handler);

/**
 * /identity-service/verifyEmail/<emailHash>
 * query: emailHash (This comes from the verification email)
 * Changes record in DB to emailVerified: true
 */
router.get('/verifyEmail', verifyEmail.handler);

/**
 * /identity-service/passwordResetInit
 *
 * Initalize
 * Headers: content-type: application/json
 * Body: email
 * Sends reset password email.
 */
router.post('/passwordResetInit', passwordResetInit.handler);

/**
 * /identity-service/passwordResetConfirm
 * Headers: content-type: application/json
 * Body: passwordResetHash, password(new password)
 * Sets new password.
 */
router.post('/passwordResetConfirm', passwordResetConfirm.handler);

/**
 * /identity-service/changeEmailInit
 * Headers: content-type: application/json, authorization: <authorization>
 * Sends change email email.
 */
router.get('/changeEmailInit', authenticate, changeEmailInit.handler);

/**
 * /identity-service/changeEmailConfirm
 * Headers: content-type: application/json
 * Body: changeEmailHash, email(new email)
 * Changes email in db.
 */
router.post('/changeEmailConfirm', changeEmailConfirm.handler);

/**
 * /identity-service/refresh
 * Headers: content-type: application/json, authorization: <refresh>
 * refreshes authorization token
 */
router.get('/refresh', refresh.handler);

/**
 * /identity-service/signOut
 * Headers: content-type: application/json, authorization: <refresh>
 * Deletes refresh token for current session
 */
router.get('/signOut', signOut.handler);

/**
 * /identity-service/docs
 * Returns json file with swagger docs
 */
router.get('/docs', (req, res) => {
  const docs = require('../docs.json');
  return res.status(200).send(docs);
});

/**
 * /identity-service/healthCheck
 */
router.get('/healthCheck', (req, res) => {
  return res.status(200).send('HEALTHY');
});

module.exports = router;
