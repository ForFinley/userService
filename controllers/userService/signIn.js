const jwtUtil = require('../utils/jwt.js');
const { queryUserByEmail } = require('../utils/database.js');
const { checkPassword } = require('../utils/crypto.js');
const {
  ValidationError,
  InvalidCredentialsError,
  resolveErrorSendResponse
} = require('../utils/errors.js');

const validate = body => {
  if (!body.email) {
    throw new ValidationError('Missing required parameter: email');
  }
  if (!body.password) {
    throw new ValidationError('Missing required parameter: password');
  }
};

module.exports.handler = async (req, res) => {
  try {
    validate(req.body);
    const email = req.body.email.trim().toLowerCase();
    const user = await queryUserByEmail(email);
    const passwordBool = checkPassword(
      req.body.password,
      user.password,
      user.salt
    );
    if (!user || !passwordBool)
      throw new InvalidCredentialsError('Email or password incorrect');

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
