const { docClient } = require('./dynamoSetup.js');
const { USER_TABLE } = require('../../env.js');

exports.queryUserByEmail = async email => {
  const params = {
    TableName: USER_TABLE,
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    },
    ReturnConsumedCapacity: 'TOTAL'
  };
  const users = await docClient.query(params).promise();
  if (users.Items[0]) return users.Items[0];
  return false;
};

exports.getUser = async userId => {
  const params = {
    TableName: USER_TABLE,
    Key: {
      userId
    },
    ReturnConsumedCapacity: 'TOTAL'
  };
  const user = await docClient.get(params).promise();
  if (user.Item) return user.Item;
  return false;
};

exports.putUser = async Item => {
  const params = {
    TableName: USER_TABLE,
    Item
  };
  return docClient.put(params).promise();
};

exports.userEmailVerified = async userId => {
  const params = {
    TableName: USER_TABLE,
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
  };
  return docClient.update(params).promise();
};

exports.updatePassword = async (userId, passwordResult) => {
  if (!passwordResult.encryptPass || !passwordResult.salt) return false;
  const params = {
    TableName: USER_TABLE,
    Key: {
      userId: userId
    },
    UpdateExpression: 'set #password = :password, #salt = :salt',
    ExpressionAttributeNames: {
      '#password': 'password',
      '#salt': 'salt'
    },
    ExpressionAttributeValues: {
      ':password': passwordResult.encryptPass,
      ':salt': passwordResult.salt
    },
    ReturnConsumedCapacity: 'TOTAL',
    ReturnValues: 'UPDATED_NEW'
  };
  return docClient.update(params).promise();
};

exports.updateEmail = async (userId, email) => {};
