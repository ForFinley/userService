const uuidv1 = require('uuid/v1');
const { encryptPassword, hashEncrypt } = require('./utils/crypto.js');
const { sendEmailVerification } = require('./utils/nodemailer.js');
const { queryUserByEmail, putUser } = require('./utils/database.js');
const { resolveErrorSendResponse } = require('./utils/errors.js');
const { validate } = require('./utils/common.js');

const model = [
  {
    param: 'body',
    field: 'email',
    required: true
  },
  {
    param: 'body',
    field: 'password',
    required: true
  }
];

module.exports.handler = async function(req, res) {
  try {
    if (!validate(req, res, model)) return;
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    const user = await queryUserByEmail(email);
    if (user && user.email)
      res.status(409).send({ message: 'Email already in use' });
    // throw new ResourceExistsError('Email already in use');

    const passwordResult = encryptPassword(password);
    const emailHash = hashEncrypt(email);
    const userId = uuidv1();
    const currentDate = new Date().toISOString();
    const putParams = {
      userId,
      email,
      password: passwordResult.encryptPass,
      salt: passwordResult.salt,
      emailVerified: false,
      provider: 'this_user_service',
      role: 'PEASANT',
      addedDate: currentDate,
      updatedDate: currentDate
    };
    putUser(putParams);
    const mailerResult = await sendEmailVerification(email, emailHash);
    if (!mailerResult) console.log('ERROR:: Email Not Sent.');
    return res.status(200).send({ userId, email });
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};
