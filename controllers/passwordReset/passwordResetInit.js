const { encrypt } = require('../utils/crypto');
const { sendPasswordReset } = require('../utils/sendGrid');
const { queryUserByEmail } = require('../utils/database');
const { ValidationError, resolveErrorSendResponse } = require('../utils/errors');

module.exports.handler = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await queryUserByEmail(email);
    if (!user) {
      throw new ValidationError('invalid user email');
    }

    const passwordResetHash = encrypt(email);

    const emailError = await sendPasswordReset(email, passwordResetHash);
    if (emailError) {
      throw new ValidationError('email not sent');
    }

    return res.status(200).send({ message: 'Password reset email sent!' });
  } catch (e) {
    return resolveErrorSendResponse(e, res);
  }
};
