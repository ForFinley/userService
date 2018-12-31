const express = require("express");
const router = express.Router();
const expressJwt = require("express-jwt");
const secret = require("../controllers/utils/keys/privateKey");
const authenticate = expressJwt({ secret: secret.key });
const addFullUser = require("../controllers/utils/addFullUser");

const adminUtil = require("../controllers/utils/adminUtil.js");
const setBillingCard = require("../controllers/payment/setBillingCard");

/**
 * payment/setBillingCard
 * Headers: authorization: Bearer <Token>
 * Body: token (from stripe)
 * Creates a customer in stripe, saves customerId to userModel
 */
router.post(
  "/setBillingCard",
  authenticate,
  addFullUser,
  setBillingCard.handler
);

module.exports = router;
