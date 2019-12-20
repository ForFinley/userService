const jwt = require('jsonwebtoken');

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
    // console.log('ERROR :: authenticateRefresh()', e);
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
      role: decodeToken.role
    };
  } catch (e) {
    console.log('ERROR :: auth()', e);
    return false;
  }
};
