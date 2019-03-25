const jwt = require('jsonwebtoken');
const { key } = require('../utils/keys/privateKey.js');
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
    key,
    {
      expiresIn: ACCESSS_TOKENTIME
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
    if (decodeToken.nbf < new Date().getTime()) throw 'Unauthorized';

    next();
  } catch (e) {
    resolveErrorSendResponse(new InvalidCredentialsError('Unauthorized'), res);
  }
};

exports.auth = async authorization => {
  try {
    const token = authorization;
    const decodeToken = await jwt.verify(token, key);
    if (decodeToken.nbf < new Date().getTime()) throw 'Unauthorized';

    return {
      userId: decodeToken.userId,
      email: decodeToken.email,
      role: decodeToken.role
    };
  } catch (e) {
    return false;
  }
};
