const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const cryptoUtil = require('../utils/crypto.js');
const httpUtil = require('../utils/httpUtil.js');
const userTable = process.env.USER_TABLE;

function validate(params, res) {

  if (!params.emailHash) {
    res.status(400).send(httpUtil.createResponse(400, "ERROR : Missing emailHash."));
    return false;
  }

  return true;
}

/**
 * Changes emailVerified field to true
 * @param {*} req 
 * @param {*} res 
 */
module.exports.handler = async function (req, res) {
  console.log("Starting function verifyEmail...");
  console.log(req.params);

  if (req.params === null || !validate(req.params, res)) {
    return;
  }

  let emailHash = req.params.emailHash; //Hash contains email
  let email = cryptoUtil.hashDecrypt(emailHash);

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

    let updateEmailVerified = await docClient.update({
      TableName: userTable,
      Key: {
        userId: userId
      },
      UpdateExpression: 'set #emailVerified = :emailVerified',
      ExpressionAttributeNames: {
        '#emailVerified': 'emailVerified'
      },
      ExpressionAttributeValues: {
        ':emailVerified': true
      },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnValues: 'UPDATED_NEW'
    }).promise();

    console.log(updateEmailVerified);

    //Checks to see if update worked
    if (updateEmailVerified.Attributes.emailVerified === true) {
      return res.status(200).send(httpUtil.createResponse(200, "SUCCESS : Email verified."));
    }
    else {
      console.log("**ERROR** Dynamo update failed.")
      return res.status(500).send(httpUtil.createResponse(500, "ERROR : email verification failed."));
    }
  }
  catch (e) {
    console.log('**ERROR** ', e);
    return res.status(500).send(httpUtil.createResponse(500, "Internal Server Error."));
  }
}