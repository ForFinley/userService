const { decrypt, encrypt } = require('../utils/crypto');
const { queryUserByEmail, updatePassword } = require('../utils/database');
const { ValidationError, resolveErrorSendResponse } = require('../utils/errors');

module.exports.handler = async (req, res) => {
  try {
    const email = decrypt(req.body.passwordResetHash);

    const encryptedPassword = encrypt(req.body.password, true);

    const user = await queryUserByEmail(email);
    if (!user) {
      throw new ValidationError('invalid user');
    }

    await updatePassword(user.userId, encryptedPassword);

    return res.status(200).send({ message: 'Password update success!' });
  } catch (e) {
    return resolveErrorSendResponse(e, res);
  }
};
