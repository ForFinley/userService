const { queryUserByEmail, userEmailVerified } = require('./utils/database.js');
const cryptoUtil = require('./utils/crypto.js');
const {
  ValidationError,
  resolveErrorSendResponse
} = require('./utils/errors.js');

module.exports.handler = async function(req, res) {
  try {
    const { emailHash } = req.validated;
    const email = cryptoUtil.hashDecrypt(emailHash);
    const user = await queryUserByEmail(email);
    if (!user) throw new ValidationError('email hash invalid');
    await userEmailVerified(user.userId);
    return res.status(200).send({ message: 'Email verified!' });
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};
