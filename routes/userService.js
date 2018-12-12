const express = require("express");
const router = express.Router();
const passport = require("passport");
const expressJwt = require("express-jwt");
const secret = require("../controllers/utils/keys/privateKey");
const authenticate = expressJwt({ secret: secret.key });

const registration = require("../controllers/userService/registration.js");
const signIn = require("../controllers/userService/signIn.js");
const changePassword = require("../controllers/userService/changePassword.js");
const verifyEmail = require("../controllers/userService/verifyEmail.js");
const passwordResetInit = require("../controllers/userService/passwordResetInit.js");
const passwordResetConfirm = require("../controllers/userService/passwordResetConfirm.js");

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
  }),signIn.handler);

/**
 * /userService/changePassword
 * Headers: content-type: application/json, authorization: Bearer <Token>
 * Body: email, password(current), newPassword
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
 * userService/me
 * Headers: authorization: Bearer <Token>
 */
router.get("/me", authenticate, function(req, res) {
  res.status(200).json(req.user);
});

/**
 * userService/passwordResetInit
 * Headers: authorization: Bearer <Token>
 * Body: email, _id
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

module.exports = router;
