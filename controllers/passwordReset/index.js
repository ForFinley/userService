const { hashEncrypt, hashDecrypt, encrypt } = require('../utils/crypto');
const { sendPasswordReset } = require('../utils/sendGrid');
const { queryUserByEmail, updatePassword } = require('../utils/database');
const {
  ValidationError,
  resolveErrorSendResponse
} = require('../utils/errors');

const getRequestMode = body => {
  let requestMode;
  if (body.email) {
    requestMode = 'PASSWORD_RESET_INIT';
    return requestMode;
  } else if (body.password && body.passwordResetHash) {
    requestMode = 'PASSWORD_RESET_CONFIRM';
    return requestMode;
  }
  throw new ValidationError('MISSING_REQUIRED_PARAMETERS');
};

module.exports.handler = async (req, res) => {
  try {
    const requestMode = getRequestMode(req.body);
    if (requestMode === 'PASSWORD_RESET_INIT') {
      const email = req.body.email;
      const emailInSystem = await queryUserByEmail(email);
      if (!emailInSystem) {
        throw new ValidationError('email is not in our system');
      }
      const passwordResetHash = hashEncrypt(email);
      const mailerResult = await sendPasswordReset(email, passwordResetHash);
      if (!mailerResult) {
        throw new ValidationError('verification email not sent');
      }
      return res.status(200).send({ message: 'Password reset email sent!' });
    } else if (requestMode === 'PASSWORD_RESET_CONFIRM') {
      const email = hashDecrypt(req.body.passwordResetHash);
      const encryptedPassword = encrypt(req.body.password, true);
      const user = await queryUserByEmail(email);
      await updatePassword(user.userId, encryptedPassword);
      return res.status(200).send({ message: 'Password update success!' });
    }
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};
