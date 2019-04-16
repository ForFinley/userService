const express = require('express');
const router = express.Router();
const { authenticate } = require('../controllers/utils/jwt.js');
const { validate } = require('../controllers/utils/validate.js');

const registration = require('../controllers/registration.js');
const signIn = require('../controllers/signIn.js');
const changePassword = require('../controllers/changePassword.js');
const verifyEmail = require('../controllers/verifyEmail.js');
const profile = require('../controllers/profile.js');
const passwordReset = require('../controllers/passwordReset.js');
const changeEmail = require('../controllers/changeEmail.js');
const refresh = require('../controllers/refresh.js');
const signOut = require('../controllers/signOut.js');

const {
  registrationSchema
} = require('../controllers/utils/validationSchemas/registration.validate.js');
const {
  changePasswordSchema
} = require('../controllers/utils/validationSchemas/changePassword.validate.js');
const {
  verifyEmailSchema
} = require('../controllers/utils/validationSchemas/verifyEmail.validate.js');
const {
  signOutSchema
} = require('../controllers/utils/validationSchemas/signOut.validate.js');

/**
 * /userService/registration
 * Body: email, password
 * Adds user to DB
 */
router.post(
  '/registration',
  validate(registrationSchema),
  registration.handler
);

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
router.post(
  '/changePassword',
  authenticate,
  validate(changePasswordSchema),
  changePassword.handler
);

/**
 * /userService/verifyEmail/<emailHash>
 * Changes record in DB to emailVerified: true
 */
router.get(
  '/verifyEmail/:emailHash',
  validate(verifyEmailSchema),
  verifyEmail.handler
);

/**
 * userService/profile
 * Headers: content-type: application/json, authorization: <authorizationToken>
 * Returns all user info needed
 */
router.get('/profile', authenticate, profile.handler);

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
router.get('/signOut', validate(signOutSchema), signOut.handler);

/**
 * userService/docs
 * Returns json file with swagger docs
 */
router.get('/docs', () => {
  const docs = require('../docs.json');
  return docs;
});

module.exports = router;
