const jwt = require('jsonwebtoken');
const {
  InvalidCredentialsError,
  resolveErrorSendResponse
} = require('./errors.js');
const {
  ACCESS_KEY,
  REFRESH_KEY,
  ACCESSS_TOKENTIME,
  REFRESH_TOKENTIME
} = process.env;

exports.generateToken = user => {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      role: user.role
    },
    ACCESS_KEY,
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
    REFRESH_KEY,
    {
      expiresIn: REFRESH_TOKENTIME
    }
  );
};

exports.authenticateRefresh = async authorization => {
  try {
    const token = authorization;
    const decodeToken = await jwt.verify(token, REFRESH_KEY);
    return {
      userId: decodeToken.userId
    };
  } catch (e) {
    return false;
  }
};

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
    resolveErrorSendResponse(new InvalidCredentialsError('Unauthorized'), res);
  }
};

exports.auth = async authorization => {
  try {
    const token = authorization;
    const decodeToken = await jwt.verify(token, ACCESS_KEY);
    return {
      userId: decodeToken.userId,
      email: decodeToken.email,
      role: decodeToken.role
    };
  } catch (e) {
    return false;
  }
};

// console.log(
//   jwt.sign(
//     {
//       userId: 'c7ab0565-832e-4c22-9518-c2f3a038572e',
//       email: 'profileemail@test.com',
//       role: 'PEASANT'
//     },
//     ACCESS_KEY
//   )
// );
