const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const cryptoUtil = require("../utils/crypto.js");
const httpUtil = require('../utils/httpUtil.js');
const nodemailer = require("../utils/nodemailer.js");
const userTable = process.env.USER_TABLE;

function validate(body, res) {

  if (!body.changeEmailHash) {
    res.status(400).send(httpUtil.createResponse(400, "ERROR : Missing changeEmailHash."));
    return false;
  }
  if (!body.email) {
    res.status(400).send(httpUtil.createResponse(400, "ERROR : Missing email."));
    return false;
  }

  return true;
}

module.exports.handler = async function (req, res) {
  console.log("Starting function changeEmailConfirm...");
  console.log(req.body);

  if (req.body === null || !validate(req.body, res)) {
    return;
  }

  let hash = req.body.changeEmailHash;
  let email = req.body.email;
  email = email.trim().toLowerCase();

  let userId = cryptoUtil.hashDecrypt(hash);
  try {

    let user = await docClient.query({
      TableName: userTable,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      },
      ReturnConsumedCapacity: 'TOTAL'
    }).promise();

    if (user.Count > 0) {
      return res.status(400).send(httpUtil.createResponse(400, "ERROR - email in use."));
    }
    else {
      let result = await docClient.update({
        TableName: userTable,
        Key: {
          userId: userId
        },
        UpdateExpression: 'set #email = :email, #emailVerified = :emailVerified',
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
      }).promise();
      console.log(result);

      //Checks to see if update worked
      if (result.Attributes.email === email && result.Attributes.emailVerified === false) {
        let emailHash = cryptoUtil.hashEncrypt(email);
        nodemailer.sendEmailVerification(email, emailHash);

        res.status(200).send(httpUtil.createResponse(200, "SUCCESS : New email updated."));
      }
      else {
        console.log("**ERROR** emailVerified update failed.")
        return res.status(500).send(httpUtil.createResponse(500, "ERROR : new email update failed."));
      }
    }
  }
  catch (e) {
    console.log('**ERROR** ', e);
    return res.status(500).send(httpUtil.createResponse(500, "Internal Server Error."));
  }
};