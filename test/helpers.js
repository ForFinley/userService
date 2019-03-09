const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION
});
const { USER_TABLE } = process.env;

exports.userInDynamo = async userId => {
  const params = {
    TableName: USER_TABLE,
    Key: { userId }
  };
  const result = await docClient.get(params).promise();
  if (result.Item && result.Item.userId) return result.Item.userId;
  return false;
};

exports.deleteUserInDynamo = async userId => {
  const params = {
    TableName: USER_TABLE,
    Key: { userId }
  };
  console.log(params);
  return docClient.delete(params).promise();
};
