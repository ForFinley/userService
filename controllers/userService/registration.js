const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const httpUtil = require("../utils/httpUtil.js");
const cryptoUtil = require("../utils/crypto.js");
const nodemailer = require("../utils/nodemailer.js");
const uuidv1 = require('uuid/v1');
const userTable = process.env.USER_TABLE;

function validate(body, res) {
  if (!body.email) {
    res.status(400).send(httpUtil.createResponse(400, "ERROR : Missing email."));
    return false;
  }
  if (!body.password) {
    res.status(400).send(httpUtil.createResponse(400, "ERROR : Missing password."));
    return false;
  }
  return true;
}

/**
 * Adds user to database
 * @param {*} req
 * @param {*} res
 */
module.exports.handler = async function (req, res) {
  console.log("Starting function registration...");
  console.log(req.body);

  if (req.body === null || !validate(req.body, res)) {
    return;
  }

  let email = req.body.email;
  let password = req.body.password;
  email = email.trim().toLowerCase();

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
      // console.log("USER: ", user);
      let passwordResult = cryptoUtil.encryptPassword(password);
      let emailHash = cryptoUtil.hashEncrypt(email);

      await docClient.put({
        TableName: userTable,
        Item: {
          userId: uuidv1(),
          email: email,
          password: passwordResult.encryptPass,
          salt: passwordResult.salt,
          emailVerified: false,
          role: "PEASANT"
        }
      }).promise();

      nodemailer.sendEmailVerification(email, emailHash);

      return res.status(200).send(httpUtil.createResponse(200, "SUCCESS : User added."));
    }
  }
  catch (e) {
    console.log('**ERROR** ', e);
    return res.status(500).send(httpUtil.createResponse(500, "Internal Server Error."));
  }
};
