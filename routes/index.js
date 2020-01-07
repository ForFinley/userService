const express = require('express');
const { authenticate } = require('../middlewares/authenticate');
const registration = require('../controllers/registration');
const signIn = require('../controllers/signIn');
const changePassword = require('../controllers/changePassword');
const verifyEmail = require('../controllers/verifyEmail');
const passwordResetInit = require('../controllers/passwordReset/passwordResetInit');
const passwordResetConfirm = require('../controllers/passwordReset/passwordResetConfirm');
const changeEmailInit = require('../controllers/changeEmail/changeEmailInit');
const changeEmailConfirm = require('../controllers/changeEmail/changeEmailConfirm');
const refresh = require('../controllers/refresh');
const signOut = require('../controllers/signOut');

const router = express.Router();

/**
 * /registration
 * Headers: content-type: application/json
 * Body: email, password, emailBool
 * Adds user to DB. Will only send verificaion email if emailBool is true.
 */
router.post('/registration', registration.handler);

/**
 * /signIn
 * This user service sign in
 * Body: email, password
 * Returns authorization token and refresh token
 */
router.post('/signIn', signIn.handler);

/**
 * /changePassword
 * Headers: content-type: application/json, authorization: <authorization>
 * Body: password(current), newPassword
 * Will save new password to DB
 */
router.post('/changePassword', authenticate, changePassword.handler);

/**
 * /verifyEmail/<emailHash>
 * query: emailHash (This comes from the verification email)
 * Changes record in DB to emailVerified: true
 */
router.get('/verifyEmail', verifyEmail.handler);

/**
 * /passwordResetInit
 * Headers: content-type: application/json
 * Body: email
 * Sends reset password email to passed in email address.
 */
router.post('/passwordResetInit', passwordResetInit.handler);

/**
 * /passwordResetConfirm
 * Headers: content-type: application/json
 * Body: passwordResetHash, password(new password)
 * Sets new password in database. passwordResetHash comes from passwordResetInit endpoint.
 */
router.post('/passwordResetConfirm', passwordResetConfirm.handler);

/**
 * /changeEmailInit
 * Headers: content-type: application/json, authorization: <authorization>
 * Sends change email email.
 */
router.get('/changeEmailInit', authenticate, changeEmailInit.handler);

/**
 * /changeEmailConfirm
 * Headers: content-type: application/json
 * Body: changeEmailHash, email(new email)
 * Changes email in db. changeEmailHash comes from changeEmailInit endpoint.
 */
router.post('/changeEmailConfirm', changeEmailConfirm.handler);

/**
 * /refresh
 * Headers: content-type: application/json, authorization: <refresh>
 * Sends a new authorization token
 */
router.get('/refresh', refresh.handler);

/**
 * /identity-service/signOut
 * Headers: content-type: application/json, authorization: <refresh>
 * Deletes refresh token from database.
 */
router.get('/signOut', signOut.handler);

/**
 * /identity-service/healthCheck
 */
router.get('/healthCheck', (req, res) => res.status(200).send('HEALTHY'));

module.exports = router;
