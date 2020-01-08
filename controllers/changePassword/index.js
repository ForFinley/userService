const { checkPassword, encrypt } = require('../utils/crypto');
const { getUser, updatePassword } = require('../utils/database');
const { InvalidCredentialsError, resolveErrorSendResponse } = require('../utils/errors');

module.exports.handler = async (req, res) => {
  try {
    const { userId } = req.user;
    const { password, newPassword } = req.body;

    const user = await getUser(userId);

    if (!checkPassword(password, user.password)) {
      throw new InvalidCredentialsError('password incorrect');
    }

    const encryptedPassword = encrypt(newPassword, true);
    await updatePassword(userId, encryptedPassword);
    return res.status(200).send({ message: 'Password update success!' });
  } catch (e) {
    return resolveErrorSendResponse(e, res);
  }
};
