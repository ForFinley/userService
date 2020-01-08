const { generateToken, generateRefreshToken } = require('../utils/jwt');
const { queryUserByEmail, putRefresh } = require('../utils/database');
const { checkPassword } = require('../utils/crypto');
const { InvalidCredentialsError, resolveErrorSendResponse } = require('../utils/errors');

module.exports.handler = async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const user = await queryUserByEmail(email);
    const passwordBool = checkPassword(req.body.password, user.password);
    if (!user || !passwordBool) {
      throw new InvalidCredentialsError('email or password incorrect');
    }

    const authorizationToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    const refreshParams = {
      refreshToken,
      userId: user.userId,
      userAgent: req.headers['user-agent'],
      addedDate: new Date().toISOString(),
      // TODO: maybe add tll so old refreshtoken records do not pile up
      // ttl: REFRESH_TOKENTIME
    };
    putRefresh(refreshParams);

    return res.status(200).send({
      userId: user.userId,
      authorization: authorizationToken,
      refresh: refreshToken,
    });
  } catch (e) {
    return resolveErrorSendResponse(e, res);
  }
};
