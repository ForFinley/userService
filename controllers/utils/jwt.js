const jwt = require('jsonwebtoken');
const { key } = require('../utils/keys/privateKey.js');
const {
  InvalidCredentialsError,
  resolveErrorSendResponse
} = require('./errors.js');
const TOKENTIME = 120 * 60; // in seconds

exports.generateToken = user => {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      role: user.role
    },
    key,
    {
      expiresIn: TOKENTIME
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
