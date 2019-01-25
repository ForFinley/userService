const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const cryptoUtil = require("./crypto.js");
const userTable = process.env.USER_TABLE;

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

module.exports = {
  passportStrategy
};
