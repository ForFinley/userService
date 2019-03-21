const { hashEncrypt, hashDecrypt } = require('../utils/crypto.js');
const {
  sendChangeEmail,
  sendEmailVerification
} = require('../utils/nodemailer.js');
const { auth } = require('../utils/jwt.js');
const { queryUserByEmail } = require('../utils/database.js');

const {
  ValidationError,
  InvalidCredentialsError,
  ResourceExistsError,
  resolveErrorSendResponse
} = require('../utils/errors.js');

const getRequestMode = body => {
  let requestMode;
  if (body.email && body.changeEmailHash) {
    requestMode = 'CHANGE_EMAIL_CONFIRM';
    return requestMode;
  } else if (
    (body.email && !body.changeEmailHash) ||
    (body.changeEmailHash && !body.email)
  ) {
    throw new ValidationError('Missing required parameters');
  }
  return;
};

module.exports.handler = async (req, res) => {
  try {
    if (getRequestMode(req.body) === 'CHANGE_EMAIL_CONFIRM') {
      const email = req.body.email.trim().toLowerCase();
      const userId = hashDecrypt(req.body.changeEmailHash);

      const user = await queryUserByEmail(email);
      if (user.Count > 0) throw new ResourceExistsError('Email already in use');

      let result = await docClient
        .update({
          TableName: userTable,
          Key: {
            userId: userId
          },
          UpdateExpression:
            'set #email = :email, #emailVerified = :emailVerified',
          ExpressionAttributeNames: {
            '#email': 'email',
            '#emailVerified': 'emailVerified'
          },
          ExpressionAttributeValues: {
            ':email': email,
            ':emailVerified': false
          },
          ReturnConsumedCapacity: 'TOTAL',
          ReturnValues: 'UPDATED_NEW'
        })
        .promise();
      console.log(result);

      //Checks to see if update worked
      if (
        result.Attributes.email === email &&
        result.Attributes.emailVerified === false
      ) {
        let emailHash = cryptoUtil.hashEncrypt(email);
        const mailerResult = await sendEmailVerification(email, emailHash);
        if (!mailerResult)
          throw new ValidationError('Verification email not sent');

        res
          .status(200)
          .send(httpUtil.createResponse(200, 'SUCCESS : New email updated.'));
      } else {
        console.log('**ERROR** emailVerified update failed.');
        return res
          .status(500)
          .send(
            httpUtil.createResponse(500, 'ERROR : new email update failed.')
          );
      }

      return res.status(200).send({ message: 'Change email complete' });
    }
    //Change Email Init
    req.user = await auth(req.headers.authorization);
    if (!req.user) throw new InvalidCredentialsError('Unauthorized');
    const newEmailHash = hashEncrypt(req.user.userId);
    const mailerResult = await sendChangeEmail(req.user.email, newEmailHash);
    if (!mailerResult) throw new ValidationError('Change email not sent');
    return res.status(200).send({ message: 'Change email sent' });
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};
