const jwt = require('jsonwebtoken');
const {
  InvalidCredentialsError,
  ForbiddenError,
  resolveErrorSendResponse,
} = require('../../controllers/utils/errors');

const { ACCESS_KEY } = process.env;

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    let decodeToken = {};

    try {
      decodeToken = await jwt.verify(token, ACCESS_KEY);
    } catch (e) {
      console.log('ERROR :: authenticate()', e);
      throw new InvalidCredentialsError('Unauthorized');
    }

    req.user = {
      userId: decodeToken.userId,
      email: decodeToken.email,
      role: decodeToken.role,
    };

    next();
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};

exports.authRole = role => (req, res, next) => {
  authenticate(req, res, () => {
    if (role === req.user.role) {
      next();
    } else {
      throw new ForbiddenError('Insufficient permissions');
    }
  });
};

exports.authenticate = authenticate;
