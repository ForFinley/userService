const uuidv4 = require('uuid/v4');
const { encrypt } = require('../utils/crypto');
const { sendEmailVerification } = require('../utils/sendGrid');
const { queryUserByEmail, putUser } = require('../utils/database');
const {
  ResourceExistsError,
  resolveErrorSendResponse
} = require('../utils/errors');

module.exports.handler = async (req, res) => {
  try {
    const { email, password, emailBool } = req.body;

    const user = await queryUserByEmail(email);
    if (user && user.email) {
      throw new ResourceExistsError('email already in use');
    }

    const encryptPass = encrypt(password, true);
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

    await putUser(putParams);

    if (emailBool) {
      const emailHash = encrypt(email);
      const emailError = await sendEmailVerification(email, emailHash);
      if (emailError) {
        console.log('ERROR:: Email Not Sent.');
        //TODO: do something here to retry
      }
    }

    return res.status(200).send({ userId, email });
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};
