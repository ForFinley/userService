const uuidv4 = require('uuid/v4');
const { encrypt } = require('../utils/crypto');
const { sendEmailVerification } = require('../utils/nodemailer');
const { queryUserByEmail, putUser } = require('../utils/database');
const {
  ResourceExistsError,
  resolveErrorSendResponse
} = require('../utils/errors');

module.exports.handler = async function(req, res) {
  try {
    const { email, password } = req.body;

    const user = await queryUserByEmail(email);
    if (user && user.email)
      throw new ResourceExistsError('email already in use');

    const encryptPass = encrypt(password, true);
    const emailHash = encrypt(email);
    const userId = uuidv4();
    const currentDate = new Date().toISOString();
    const putParams = {
      userId,
      email,
      password: encryptPass,
      emailVerified: false,
      provider: 'thisUserService',
      role: 'PEASANT',
      addedDate: currentDate,
      updatedDate: currentDate
    };

    putUser(putParams);
    // const mailerResult = await sendEmailVerification(email, emailHash);
    // if (!mailerResult) console.log('ERROR:: Email Not Sent.');
    return res.status(200).send({ userId, email });
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};
