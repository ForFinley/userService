const {
  hashEncrypt,
  hashDecrypt,
  encryptPassword
} = require('../utils/crypto.js');
const { passwordReset } = require('../utils/nodemailer.js');
const { queryUserByEmail, updatePassword } = require('../utils/database.js');
const {
  ValidationError,
  resolveErrorSendResponse
} = require('../utils/errors.js');

const validate = body => {
  let requestMode;
  if (body.email) {
    requestMode = 'PASSWORD_RESET_INIT';
    return requestMode;
  } else if (body.password && body.passwordResetHash) {
    requestMode = 'PASSWORD_RESET_CONFIRM';
    return requestMode;
  }
  throw new ValidationError('Missing required parameters');
};

module.exports.handler = async (req, res) => {
  try {
    const requestMode = validate(req.body);
    if (requestMode === 'PASSWORD_RESET_INIT') {
      const email = req.body.email;
      const passwordResetHash = hashEncrypt(email);
      const mailerResult = await passwordReset(email, passwordResetHash);
      if (!mailerResult) throw new ValidationError('Email not sent');
      return res.status(200).send({ message: 'Password reset email sent' });
    } else if (requestMode === 'PASSWORD_RESET_CONFIRM') {
      const email = hashDecrypt(req.body.passwordResetHash);
      const passwordResult = encryptPassword(req.body.password);
      const user = await queryUserByEmail(email);
      await updatePassword(user.userId, passwordResult);
      return res.status(200).send({ message: 'Password update success!' });
    }
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};
