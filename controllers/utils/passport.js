const cryptoUtil = require('./crypto.js');
const httpUtil = require('../utils/httpUtil.js');
// const { OAuth2Client } = require('google-auth-library');
const { GOOGLE_CLIENT_ID } = require('../../env.js');

const provider = async (req, res, next) => {
  const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

  if (req.body.provider === 'google') {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: req.headers.authorization,
        audience: CLIENT_ID
      });
      const payload = ticket.getPayload();

      let user = await docClient
        .query({
          TableName: USER_TABLE,
          IndexName: 'email-index',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': payload.email
          },
          ReturnConsumedCapacity: 'TOTAL'
        })
        .promise();

      if (user.Count > 0) {
        let password = cryptoUtil.hashDecrypt(user.Items[0].password);
        password = password.split(user.Items[0].salt)[0];
        req.body.email = payload.email;
        req.body.password = password;
      } else {
        req.body.email = payload.email;
        req.body.password = payload.sub;
      }
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .send(httpUtil.createResponse(400, 'ERROR - Google SignIn Failed.'));
    }
  }
  next();
};

module.exports = {
  provider
};
