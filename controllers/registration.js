const uuidv1 = require('uuid/v1');
const { encryptPassword, hashEncrypt } = require('./utils/crypto.js');
const { sendEmailVerification } = require('./utils/nodemailer.js');
const { queryUserByEmail, putUser } = require('./utils/database.js');
const {
  ValidationError,
  ResourceExistsError,
  resolveErrorSendResponse
} = require('./utils/errors.js');

const validate = body => {
  if (!body.email) {
    throw new ValidationError('Missing required parameter: email');
  }
  if (!body.password) {
    throw new ValidationError('Missing required parameter: password');
  }
};

module.exports.handler = async function(req, res) {
  try {
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
    const mailerResult = await sendEmailVerification(email, emailHash);
    if (!mailerResult) console.log('ERROR:: Email Not Sent.');
    return res.status(200).send({ userId, email });
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};
