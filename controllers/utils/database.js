const { docClient } = require('./dynamoSetup.js');
const { USER_TABLE } = require('../../env.js');

exports.queryUserByEmail = async email => {
  let params = {
    TableName: USER_TABLE,
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    },
    ReturnConsumedCapacity: 'TOTAL'
  };
  let users = await docClient.query(params).promise();
  return users.Items[0];
};

exports.putUser = async Item => {
  let params = {
    TableName: USER_TABLE,
    Item
  };
  return docClient.put(params).promise();
};
