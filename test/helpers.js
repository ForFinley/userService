const { docClient } = require('../controllers/utils/dynamoSetup.js');
const { USER_TABLE } = require('../env.js');

exports.userInDynamo = async userId => {
  const params = {
    TableName: USER_TABLE,
    Key: { userId }
  };
  const result = await docClient.get(params).promise();
  if (result.Item && result.Item.userId) return true;
  return false;
};

exports.getUser = async userId => {
  const params = {
    TableName: USER_TABLE,
    Key: { userId }
  };
  const result = await docClient.get(params).promise();
  if (result.Item && result.Item.userId) return result.Item;
  return false;
};
