const express = require("express");
const router = express.Router();
const passport = require("passport");
const expressJwt = require("express-jwt");
const secret = require("../controllers/utils/keys/privateKey");
const authenticate = expressJwt({ secret: secret.key });
const addFullUser = require("../controllers/utils/addFullUser");

const registration = require("../controllers/userService/registration.js");
const signIn = require("../controllers/userService/signIn.js");
const changePassword = require("../controllers/userService/changePassword.js");
const verifyEmail = require("../controllers/userService/verifyEmail.js");
const passwordResetInit = require("../controllers/userService/passwordResetInit.js");
const passwordResetConfirm = require("../controllers/userService/passwordResetConfirm.js");
const changeEmailInit = require("../controllers/userService/changeEmailInit.js");
const changeEmailConfirm = require("../controllers/userService/changeEmailConfirm.js");

/**
 * /userService/registration
 * Body: email, password
 * Adds user to DB
 */
router.post("/registration", registration.handler);

/**
 * /userService/signIn
 * Body: email, password
 * Returns Bearer authorization token
 */
router.post("/signIn", passport.initialize(), passport.authenticate("local", {
  session: false,
  scope: []
}), signIn.handler);

/**
 * /userService/changePassword
 * Headers: content-type: application/json, authorization: Bearer <Token>
 * Body: password(current), newPassword
 * Will save new password to DB
 */
router.post("/changePassword", authenticate, changePassword.handler);

/**
 * /userService/verifyEmail/<emailHash>
 * Headers: content-type: application/json
 * Changes record in DB to emailVerified: true
 */
router.get("/verifyEmail/:emailHash", verifyEmail.handler);

/**
 * TEST
 * userService/me
 * Headers: authorization: Bearer <Token>
 */
router.get("/me", authenticate, addFullUser, function (req, res) {
  delete req.user.password;
  delete req.user.salt;
  delete req.user.stripeCustomerId;
  res.status(200).json(req.user);
});

/**
 * userService/passwordResetInit
 * Headers: content-type: application/json
 * Body: email
 * Sends reset password email.
 */
router.post("/passwordResetInit", passwordResetInit.handler);

/**
 * userService/passwordResetConfirm
 * Headers: content-type: application/json
 * Body: passwordResetHash, password(new password)
 * Sets new password.
 */
router.post("/passwordResetConfirm", passwordResetConfirm.handler);

/**
 * userService/changeEmailInit
 * Headers: content-type: application/json, authorization: Bearer <Token>
 * Body: email
 * Sends change email email.
 */
router.post("/changeEmailInit", authenticate, changeEmailInit.handler);

/**
 * userService/changeEmailConfirm
 * Headers: content-type: application/json
 * Body: changeEmailHash, email(new email)
 * Changes email.
 */
router.post("/changeEmailConfirm", changeEmailConfirm.handler);

module.exports = router;
