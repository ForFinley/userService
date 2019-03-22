const { queryUserByEmail, userEmailVerified } = require('./utils/database.js');
const cryptoUtil = require('./utils/crypto.js');
const {
  ValidationError,
  resolveErrorSendResponse
} = require('./utils/errors.js');

function validate(params) {
  if (!params.emailHash || params.emailHash === 'undefined') {
    throw new ValidationError('Missing required parameter: email');
  }
}

module.exports.handler = async function(req, res) {
  try {
    validate(req.params);
    const email = cryptoUtil.hashDecrypt(req.params.emailHash);
    const user = await queryUserByEmail(email);
    if (!user) throw new ValidationError('email hash invalid');
    await userEmailVerified(user.userId);
    return res.status(200).send({ message: 'email verified' });
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};
