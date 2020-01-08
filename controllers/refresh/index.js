const { getRefresh, getUser } = require('../utils/database');
const { authenticateRefresh, generateToken } = require('../utils/jwt');
const {
  InvalidCredentialsError,
  ResourceExistsError,
  resolveErrorSendResponse,
} = require('../utils/errors');

module.exports.handler = async (req, res) => {
  try {
    const refreshToken = req.headers.authorization;
    const decryptToken = await authenticateRefresh(refreshToken);
    if (!decryptToken) {
      throw new InvalidCredentialsError('unauthorized');
    }

    // TODO :: refresh table should have ttl so old refreshTokens get deleted
    const refreshRecord = await getRefresh(refreshToken);
    if (!refreshRecord) {
      throw new ResourceExistsError('invalid refresh token');
    }

    const user = await getUser(refreshRecord.userId);
    const authorization = generateToken(user);

    return res.status(200).send({
      authorization,
      refresh: refreshToken,
    });
  } catch (e) {
    return resolveErrorSendResponse(e, res);
  }
};
