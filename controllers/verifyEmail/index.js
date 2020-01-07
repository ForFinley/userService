const { queryUserByEmail, userEmailVerified } = require('../utils/database');
const { decrypt } = require('../utils/crypto');
const {
  ValidationError,
  resolveErrorSendResponse,
} = require('../utils/errors');

module.exports.handler = async (req, res) => {
  try {
    const { emailHash } = req.query;

    const email = decrypt(emailHash);
    if (!email) {
      throw new ValidationError('email hash invalid');
    }

    const user = await queryUserByEmail(email);
    if (!user) {
      throw new ValidationError('user email hash invalid');
    }

    await userEmailVerified(user.userId);
    return res.status(200).send({ message: 'Email verified!' });
  } catch (e) {
    return resolveErrorSendResponse(e, res);
  }
};
