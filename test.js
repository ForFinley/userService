const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

let userTable = "users";
let userId = "1";
let email = "ryqan33@gmail.com"

async function t() {
  try {
    // let user = await docClient.get({
    //   TableName: "users",
    //   Key: {
    //     userId: "1"
    //   },
    //   ReturnConsumedCapacity: 'TOTAL'
    // }).promise();

    // if (user.Item) console.log(user);


    // let r = await docClient.update({
    //   TableName: userTable,
    //   Key: {
    //     userId: userId
    //   },
    //   UpdateExpression: 'set #emailVerified = :emailVerified',
    //   ExpressionAttributeNames: {
    //     '#emailVerified': 'emailVerified'
    //   },
    //   ExpressionAttributeValues: {
    //     ':emailVerified': true
    //   },
    //   ReturnConsumedCapacity: 'TOTAL',
    //   ReturnValues: 'UPDATED_NEW'
    // }).promise();

    // let r = await docClient.query({
    //   TableName: userTable,
    //   IndexName: 'email-index',
    //   KeyConditionExpression: 'email = :email',
    //   ExpressionAttributeValues: {
    //     ':email': email
    //   },
    //   ReturnConsumedCapacity: 'TOTAL'
    // }).promise();

    // console.log(r.Items[0].userId);

    let r = await docClient.scan({
      TableName: userTable
    }).promise();
    console.log(r)
  }
  catch (e) {
    console.log(e);
  }

}

t();