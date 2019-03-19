const { checkPassword, encryptPassword } = require('../utils/crypto.js');
const { getUser, updatePassword } = require('../utils/database.js');
const {
  ValidationError,
  InvalidCredentialsError,
  resolveErrorSendResponse
} = require('../utils/errors.js');

const validate = body => {
  if (!body.password) {
    throw new ValidationError('Missing required parameter: password');
  }
  if (!body.newPassword) {
    throw new ValidationError('Missing required parameter: newPassword');
  }
};

module.exports.handler = async function(req, res) {
  try {
    validate(req.body);
    const userId = req.user.userId;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const user = await getUser(userId);

    if (!checkPassword(password, user.password, user.salt))
      throw new InvalidCredentialsError('Password incorrect');
    const passwordResult = encryptPassword(newPassword);
    await updatePassword(userId, passwordResult);
    return res.status(200).send({ message: 'Password update success!' });
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};
