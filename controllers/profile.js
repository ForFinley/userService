const { getUser } = require('./utils/database.js');
const {
  ValidationError,
  resolveErrorSendResponse
} = require('./utils/errors.js');

module.exports.handler = async (req, res, next) => {
  try {
    if (!req.user.userId) throw new ValidationError('MISSING_AUTH_TOKEN');
    const user = getUser(req.user.userId);

    return {
      userId: user.userId,
      email: user.email,
      emailVerified: user.emailVerified,
      role: user.role
    };
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};
