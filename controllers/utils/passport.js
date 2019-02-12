const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const cryptoUtil = require("./crypto.js");
const httpUtil = require("../utils/httpUtil.js");
const { OAuth2Client } = require('google-auth-library');
const userTable = process.env.USER_TABLE;
const googleClientId = process.env.GOOGLE_CLIENT_ID;


async function passportStrategy(email, password, done) {

  email = email.trim().toLowerCase();
  try {
    var user = await docClient.query({
      TableName: userTable,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      },
      ReturnConsumedCapacity: 'TOTAL'
    }).promise();

  } catch (e) {
    console.log("**ERROR** ", e);
    return;
  }
  if (user.Count > 0) {
    if (cryptoUtil.checkPassword(password, user.Items[0].password, user.Items[0].salt))
      done(null, user.Items[0]);
  }
  done(null, false);
}

async function provider(req, res, next) {
  const CLIENT_ID = googleClientId;
  const client = new OAuth2Client(CLIENT_ID);

  if (req.body.provider === "google") {
    try {
      const ticket = await client.verifyIdToken({
        idToken: req.headers.authorization,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();

      let user = await docClient.query({
        TableName: userTable,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': payload.email
        },
        ReturnConsumedCapacity: 'TOTAL'
      }).promise();

      if (user.Count > 0) {
        let password = cryptoUtil.hashDecrypt(user.Items[0].password);
        password = password.split(user.Items[0].salt)[0];
        req.body.email = payload.email;
        req.body.password = password;
      }

    }
    catch (e) {
      console.log(e);
      return res.status(400).send(httpUtil.createResponse(400, "ERROR - Google SignIn Failed."));
    }
  }
  next();
}

module.exports = {
  passportStrategy,
  provider
};
