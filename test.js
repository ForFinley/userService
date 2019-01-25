const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const uuidv1 = require('uuid/v1');

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

// t();

console.log(uuidv1());


const changes = {
  stripeBillingCardBrand: card.brand,
  stripeBillingCardExpMonth: card.exp_month,
  stripeBillingCardExpYear: card.exp_year,
  stripeBillingCardLast4: card.last4,
  stripeCustomerId: result.id,
  stripeCardId: card.id,
  shippingAddressLine1: req.body.line1,
  shippingAddressCity: req.body.city,
  shippingAddressCountry: req.body.country,
  shippingAddressLine2: req.body.line2,
  shippingAdddressPostalCode: req.body.postalCode,
  shippingAddressState: req.body.state
};


let updateExpression = 'set #stripeBillingCardBrand = :stripeBillingCardBrand, #stripeBillingCardExpMonth = :stripeBillingCardExpMonth';
updateExpression += ', #stripeBillingCardExpYear = :stripeBillingCardExpYear, #stripeBillingCardLast4 = :stripeBillingCardLast4';
updateExpression += ', #stripeCardId = :stripeCardId, #shippingAddressLine1 = :shippingAddressLine1, #shippingAddressCity = :shippingAddressCity';
updateExpression += ', #shippingAddressCountry = :shippingAddressCountry, #shippingAddressLine2 = :shippingAddressLine2';
updateExpression += ', #shippingAdddressPostalCode = :shippingAdddressPostalCode, #shippingAddressState = :shippingAddressState';
if (newCustomer === true) updateExpression += ', #stripeCustomerId = :stripeCustomerId'


let updateRequest = {
  TableName: tableName,
  Key: {
    userId: req.user.userId
  },
  UpdateExpression: updateExpression,
  ExpressionAttributeNames: {
    '#stripeBillingCardBrand': 'stripeBillingCardBrand', '#stripeBillingCardExpMonth': 'stripeBillingCardExpMonth',
    '#stripeBillingCardExpYear': 'stripeBillingCardExpYear', '#stripeBillingCardLast4': 'stripeBillingCardLast4',
    '#stripeCustomerId': 'stripeCustomerId', '#stripeCardId': 'stripeCardId', '#shippingAddressLine1': 'shippingAddressLine1',
    '#shippingAddressCity': 'shippingAddressCity', '#shippingAddressCountry': 'shippingAddressCountry', '#shippingAddressLine2': 'shippingAddressLine2',
    '#shippingAdddressPostalCode': 'shippingAdddressPostalCode', '#shippingAddressState': 'shippingAddressState'
  },
  ExpressionAttributeValues: {
    ':stripeBillingCardBrand': card.brand,
    ':stripeBillingCardExpMonth': card.exp_month,
    ':stripeBillingCardExpYear': card.exp_year,
    ':stripeBillingCardLast4': card.last4,
    ':stripeCustomerId': result.id,
    ':stripeCardId': card.id,
    ':shippingAddressLine1': req.body.line1,
    ':shippingAddressCity': req.body.city,
    ':shippingAddressCountry': req.body.country,
    ':shippingAddressLine2': req.body.country,
    ':shippingAdddressPostalCode': req.body.postalCode,
    ':shippingAddressState': req.body.state
  },
  ReturnConsumedCapacity: 'TOTAL',
  ReturnValues: 'UPDATED_NEW'
};

