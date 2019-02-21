const uuidv1 = require("uuid/v1");
const { createResponse } = require("../utils/common.js");
const { encryptPassword, hashEncrypt } = require("../utils/crypto.js");
const { sendEmailVerification } = require("../utils/nodemailer.js");
const { queryUserEmailIndex, putUser } = require("../utils/dynamo.js");
const {
  ValidationError,
  ResourceExistsError,
  resolveErrorSendResponse
} = require("../utils/errors.js");

function validate(body) {
  if (!body.email) {
    throw new ValidationError(`Missing required parameter ${body.email}`);
  }
  if (!body.password) {
    throw new ValidationError(`Missing required parameter ${body.password}`);
  }
  return true;
}

module.exports.handler = async function(req, res) {
  try {
    console.log("Starting function registration...");
    console.log(req.body);

    if (req.body === null || !validate(req.body))
      throw new ValidationError("Missing body");

    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    const user = await queryUserEmailIndex(email);
    if (user && user.email)
      throw new ResourceExistsError("Email already in use");

    const passwordResult = encryptPassword(password);
    const emailHash = hashEncrypt(email);

    const userId = uuidv1();
    const putParams = {
      userId,
      email,
      password: passwordResult.encryptPass,
      salt: passwordResult.salt,
      emailVerified: false,
      role: "PEASANT"
    };
    putUser(putParams);

    sendEmailVerification(email, emailHash);

    return res.status(200).send({ userId, email });
  } catch (e) {
    console.log("**ERROR** ", e);
    resolveErrorSendResponse(e, res);
  }
};
