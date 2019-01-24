const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const cryptoUtil = require('../utils/crypto.js');
const httpUtil = require('../utils/httpUtil.js');
const userTable = process.env.USER_TABLE;

function validate(body, res) {

  if (!body.password) {
    res.status(400).send(httpUtil.createResponse(400, "ERROR : Missing password."));
    return false;
  }
  if (!body.newPassword) {
    res.status(400).send(httpUtil.createResponse(400, "ERROR : Missing newPassword."));
    return false;
  }
  return true;
}

/**
 * Changes password in database
 * @param {*} req
 * @param {*} res
 */
module.exports.handler = async function (req, res) {
  console.log("Starting function changePassword...");
  console.log(req.body);

  if (req.body === null || !validate(req.body, res)) {
    return;
  }

  let userId = req.user.userId;
  let password = req.body.password;
  let newPassword = req.body.newPassword;

  let idBool = true; //Checks to see if emnail is in database

  try {

    let user = await docClient.get({
      TableName: userTable,
      Key: {
        userId: userId
      },
      ReturnConsumedCapacity: 'TOTAL'
    }).promise();

    if (user.Item) {
      idBool = false;
      if (cryptoUtil.checkPassword(password, user.Item.password, user.Item.salt)) {
        let passwordResult = cryptoUtil.encryptPassword(newPassword);

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

        //Checks to see if update worked
        if (updatePassword.Attributes.password === passwordResult.encryptPass) {
          return res.send(httpUtil.createResponse(200, "SUCCESS : Password changed."));
        }
        else {
          console.log("**ERROR** Dynamo update failed.")
          return res.send(httpUtil.createResponse(500, "ERROR : Password change failed."));
        }
      }
      else {
        console.log("Password incorrect.")
        return res.status(401).send(httpUtil.createResponse(401, "ERROR : email or password invalid."));
      }
    }
  }
  catch (e) {
    console.log('**ERROR** ', e);
    return res.send(httpUtil.createResponse(500, "ERROR : Internal server error."));
  }
  if (idBool) {
    console.log("email does not exist.");
    return res.status(401).send(httpUtil.createResponse(401, "ERROR : email or password invalid."));
  }
}
