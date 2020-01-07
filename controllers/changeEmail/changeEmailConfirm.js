const { encrypt, decrypt } = require('../utils/crypto');
const { sendEmailVerification } = require('../utils/sendGrid');
const { queryUserByEmail, updateEmail } = require('../utils/database');
const {
  ValidationError,
  ResourceExistsError,
  resolveErrorSendResponse,
} = require('../utils/errors');

module.exports.handler = async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const userId = decrypt(req.body.changeEmailHash);
    if (!userId) {
      throw new ValidationError('invalid email hash');
    }

    const user = await queryUserByEmail(email);
    if (user) {
      throw new ResourceExistsError('email already in use');
    }

    await updateEmail(userId, email);

    const emailHash = encrypt(email);

    const emailError = await sendEmailVerification(email, emailHash);
    if (emailError) {
      console.log('ERROR:: Email Not Sent.');
      // TODO: do something here to retry
    }

    return res.status(200).send({ message: 'Change email complete!' });
  } catch (e) {
    return resolveErrorSendResponse(e, res);
  }
};
