const jwt = require('jsonwebtoken');
const {
  InvalidCredentialsError,
  resolveErrorSendResponse
} = require('../../controllers/utils/errors.js');
const { ACCESS_KEY } = process.env;

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodeToken = await jwt.verify(token, ACCESS_KEY);

    req.user = {
      userId: decodeToken.userId,
      email: decodeToken.email,
      role: decodeToken.role
    };
    next();
  } catch (e) {
    console.log('ERROR :: authenticate()', e);
    resolveErrorSendResponse(new InvalidCredentialsError('Unauthorized'), res);
  }
};
