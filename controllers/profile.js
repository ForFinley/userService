const { getUser } = require('./utils/database.js');
const {
  ValidationError,
  resolveErrorSendResponse
} = require('./utils/errors.js');

module.exports.handler = async (req, res, next) => {
  try {
    const user = await getUser(req.user.userId);
    if (!user) throw new ValidationError('user not found'); //ths should be impossible

    const payload = {
      userId: user.userId,
      email: user.email,
      emailVerified: user.emailVerified,
      role: user.role,
      billingAddress: user.billingAddress,
      creditCard: user.creditCard
    };
    return res.status(200).send(payload);
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};
