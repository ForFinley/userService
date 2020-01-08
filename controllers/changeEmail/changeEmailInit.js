const { encrypt } = require('../utils/crypto');
const { sendChangeEmail } = require('../utils/sendGrid');
const { ValidationError, resolveErrorSendResponse } = require('../utils/errors');

module.exports.handler = async (req, res) => {
  try {
    const newEmailHash = encrypt(req.user.userId);

    const emailError = await sendChangeEmail(req.user.email, newEmailHash);
    if (emailError) {
      throw new ValidationError('email not sent');
    }

    return res.status(200).send({ message: 'Change email sent!' });
  } catch (e) {
    return resolveErrorSendResponse(e, res);
  }
};
