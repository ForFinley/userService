const jwt = require('jsonwebtoken');
const { accessKey, refreshKey } = require('./keys/privateKeys.js');
const {
  InvalidCredentialsError,
  resolveErrorSendResponse
} = require('./errors.js');
const ACCESSS_TOKENTIME = 120 * 60; // in seconds
const REFRESH_TOKENTIME = 1200 * 60; // in seconds

exports.generateToken = user => {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      role: user.role
    },
    accessKey,
    {
      expiresIn: ACCESSS_TOKENTIME
    }
  );
};

exports.generateRefreshToken = user => {
  return jwt.sign(
    {
      userId: user.userId
    },
    refreshKey,
    {
      expiresIn: REFRESH_TOKENTIME
    }
  );
};

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodeToken = await jwt.verify(token, key);
    req.user = {
      userId: decodeToken.userId,
      email: decodeToken.email,
      role: decodeToken.role
    };
    next();
  } catch (e) {
    resolveErrorSendResponse(new InvalidCredentialsError('Unauthorized'), res);
  }
};

exports.auth = async authorization => {
  try {
    const token = authorization;
    const decodeToken = await jwt.verify(token, key);
    return {
      userId: decodeToken.userId,
      email: decodeToken.email,
      role: decodeToken.role
    };
  } catch (e) {
    return false;
  }
};
