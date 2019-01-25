const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const cryptoUtil = require("../utils/crypto.js");
const httpUtil = require('../utils/httpUtil.js');
const userTable = process.env.USER_TABLE;

function validate(body, res) {

  if (!body.passwordResetHash) {
    res.status(400).send(httpUtil.createResponse(400, "ERROR : Missing passwordResetHash."));
    return false;
  }
  if (!body.password) {
    res.status(400).send(httpUtil.createResponse(400, "ERROR : Missing password."));
    return false;
  }

  return true;
}

module.exports.handler = async function (req, res) {
  console.log("Starting function passwordResetConfirm...");
  console.log(req.body);

  if (req.body === null || !validate(req.body, res)) {
    return;
  }

  let hash = req.body.passwordResetHash;
  let password = req.body.password;
  let email = cryptoUtil.hashDecrypt(hash); //passwordResetHash contains email

  let passwordResult = cryptoUtil.encryptPassword(password);

  try {

    let result = await docClient.query({
      TableName: userTable,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      },
      ReturnConsumedCapacity: 'TOTAL'
    }).promise();
    let userId = result.Items[0].userId;

    let updatePassword = await docClient.update({
      TableName: userTable,
      Key: {
        userId: userId
      },
      UpdateExpression: 'set #password = :password, #salt = :salt',
      ExpressionAttributeNames: {
        '#password': 'password', '#salt': 'salt'
      },
      ExpressionAttributeValues: {
        ':password': passwordResult.encryptPass,
        ':salt': passwordResult.salt
      },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnValues: 'UPDATED_NEW'
    }).promise();

    console.log(updatePassword);

    //Checks to see if update worked
    if (updatePassword.Attributes.password === passwordResult.encryptPass) {
      return res.send(httpUtil.createResponse(200, "SUCCESS : Password reset."));
    }
    else {
      console.log("**ERROR** Dynamo update failed.")
      return res.send(httpUtil.createResponse(500, "ERROR : Password reset failed."));
    }

  }
  catch (e) {
    console.log('**ERROR** ', e);
    return res.status(500).send(httpUtil.createResponse(500, "Internal Server Error."));
  }
};