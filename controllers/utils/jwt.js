const jwt = require('jsonwebtoken');

const {
  ACCESS_KEY,
  REFRESH_KEY,
  ACCESSS_TOKEN_TIME,
  REFRESH_TOKEN_TIME,
} = process.env;

exports.generateToken = user =>
  // eslint-disable-next-line implicit-arrow-linebreak
  jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      role: user.role,
    },
    ACCESS_KEY,
    {
      expiresIn: ACCESSS_TOKEN_TIME,
    },
  );

exports.generateRefreshToken = user =>
  // eslint-disable-next-line implicit-arrow-linebreak
  jwt.sign(
    {
      userId: user.userId,
    },
    REFRESH_KEY,
    {
      expiresIn: REFRESH_TOKEN_TIME,
    },
  );

exports.authenticateRefresh = async authorization => {
  try {
    const token = authorization;
    const decodeToken = await jwt.verify(token, REFRESH_KEY);
    return {
      userId: decodeToken.userId,
    };
  } catch (e) {
    console.log('ERROR :: authenticateRefresh()', e);
    return false;
  }
};

exports.auth = async authorization => {
  try {
    const token = authorization;
    const decodeToken = await jwt.verify(token, ACCESS_KEY);
    return {
      userId: decodeToken.userId,
      email: decodeToken.email,
      role: decodeToken.role,
    };
  } catch (e) {
    console.log('ERROR :: auth()', e);
    return false;
  }
};
