const { checkPassword, encryptPassword } = require('./utils/crypto.js');
const { getUser, updatePassword } = require('./utils/database.js');
const {
  InvalidCredentialsError,
  resolveErrorSendResponse
} = require('./utils/errors.js');

module.exports.handler = async function(req, res) {
  try {
    const userId = req.user.userId;
    const { password, newPassword } = req.body;

    const user = await getUser(userId);

    if (!checkPassword(password, user.password, user.salt))
      throw new InvalidCredentialsError('password incorrect');
    const passwordResult = encryptPassword(newPassword);
    await updatePassword(userId, passwordResult);
    return res.status(200).send({ message: 'Password update success!' });
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};
