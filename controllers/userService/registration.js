const uuidv1 = require('uuid/v1');
const { encryptPassword, hashEncrypt } = require('../utils/crypto.js');
const { sendEmailVerification } = require('../utils/nodemailer.js');
const { queryUserByEmail, putUser } = require('../utils/database.js');
const {
  ValidationError,
  ResourceExistsError,
  resolveErrorSendResponse
} = require('../utils/errors.js');

function validate(body) {
  if (!body.email) {
    throw new ValidationError(`Missing required parameter ${body.email}`);
  }
  if (!body.password) {
    throw new ValidationError(`Missing required parameter ${body.password}`);
  }
}

module.exports.handler = async function(req, res) {
  try {
    console.log('Starting function registration...');
    console.log(req.body);

    validate(req.body);

    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    const user = await queryUserByEmail(email);
    if (user && user.email)
      throw new ResourceExistsError('Email already in use');

    const passwordResult = encryptPassword(password);
    const emailHash = hashEncrypt(email);

    const userId = uuidv1();
    const putParams = {
      userId,
      email,
      password: passwordResult.encryptPass,
      salt: passwordResult.salt,
      emailVerified: false,
      role: 'PEASANT'
    };
    putUser(putParams);
    sendEmailVerification(email, emailHash);
    return res.status(200).send({ userId, email });
  } catch (e) {
    console.log('**ERROR** ', e);
    resolveErrorSendResponse(e, res);
  }
};
