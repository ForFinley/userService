const jwtUtil = require('./utils/jwt.js');
const rp = require('request-promise');
const uuidv1 = require('uuid/v1');
const { queryUserByEmail, putUser } = require('./utils/database.js');
const { checkPassword, hashEncrypt } = require('./utils/crypto.js');
const { sendEmailVerification } = require('./utils/nodemailer.js');
const {
  ValidationError,
  InvalidCredentialsError,
  resolveErrorSendResponse
} = require('./utils/errors.js');
const { GOOGLE_DECRYPT_API } = require('../env.js');

const getRequestMode = req => {
  if (req.body.email && req.body.password) return 'THIS_USER_SERVICE';
  if (req.body.provider && req.headers.authorization) return 'OUTSIDE_PROVIDER';
  throw new ValidationError('MISSING_REQUIRED_PARAMS');
};

module.exports.handler = async (req, res) => {
  try {
    const requestMode = getRequestMode(req);
    let user;
    if (requestMode === 'THIS_USER_SERVICE') user = await thisUserService(req);
    else if (requestMode === 'OUTSIDE_PROVIDER') user = await provider(req);

    const token = jwtUtil.generateToken(user);
    res.status(200).send({
      user: {
        userId: user.userId,
        email: user.email
      },
      token: token
    });
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};

const thisUserService = async req => {
  const email = req.body.email.trim().toLowerCase();
  const user = await queryUserByEmail(email);
  const passwordBool = checkPassword(
    req.body.password,
    user.password,
    user.salt
  );
  if (!user || !passwordBool)
    throw new InvalidCredentialsError('Email or password incorrect');
  return user;
};

const provider = async req => {
  const provider = req.body.provider.trim().toLowerCase();
  if (provider === 'google') {
    const googleResponse = await decodeGoogleToken(req.headers.authorization);
    const email = googleResponse.email.trim().toLowerCase();
    const user = await queryUserByEmail(email);
    if (user && user.provider === 'google') return user;
    if (!user) {
      const putParams = {
        userId: uuidv1(),
        email,
        emailVerified: false,
        provider: 'google',
        role: 'PEASANT'
      };
      putUser(putParams);
      const emailHash = hashEncrypt(email);
      const mailerResult = await sendEmailVerification(email, emailHash);
      if (!mailerResult) console.log('ERROR:: Email Not Sent.');
      return putParams;
    }
    throw new InvalidCredentialsError(
      `Email already in use with ${user.provider}`
    );
  }
};

const decodeGoogleToken = async token => {
  const url = `${GOOGLE_DECRYPT_API}/oauth2/v3/tokeninfo?idToken=${token}`;
  const requestParams = {
    uri: url,
    json: true
  };
  return rp(requestParams);
};
