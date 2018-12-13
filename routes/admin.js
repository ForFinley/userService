const express = require("express");
const router = express.Router();
const expressJwt = require("express-jwt");
const secret = require("../controllers/utils/keys/privateKey");
const authenticate = expressJwt({ secret: secret.key });

const adminUtil = require("../controllers/utils/adminUtil.js");
const allUsers = require("../controllers/admin/allUsers.js");

/**
 * admin/allUsers
 * Headers: authorization: Bearer <Token>
 * Returns all users in database
 */
router.get("/allUsers", authenticate, adminUtil.isAdmin, allUsers.handler);

module.exports = router;
