const { getRefresh } = require('./utils/database.js');
const { authenticateRefresh } = require('./utils/jwt.js');
const {
  InvalidCredentialsError,
  resolveErrorSendResponse
} = require('./utils/errors.js');

module.exports.handler = async function(req, res) {
  try {
    const refreshToken = req.headers.authorization;
    const decryptToken = await authenticateRefresh(refreshToken);
    if (!decryptToken) throw new InvalidCredentialsError('Unauthorized');

    const r = await getRefresh(refreshToken, decryptToken.userId);
    console.log('RESULT', r);
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};
