const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const stripe = require("./stripeInstance");
const httpUtil = require('../utils/httpUtil.js');
const userTable = process.env.USER_TABLE;

/**
 * Reference: https://stripe.com/docs/sources/results
 */

//check for token (that comes from stripe on the client request)
function validate(body, res) {
  if (!body.token) {
    res.status(400).send(httpUtil.createResponse(400, "ERROR : Missing source (token)."));
    return false;
  }
  return true;
}

module.exports.handler = async function (req, res) {
  console.log("Starting function setBillingCard...");
  console.log(req.body);

  if (req.body === null || !validate(req.body, res)) {
    return;
  }

  let params = {
    email: req.user.email,
    source: req.body.token,
    //shipping address
    line1: req.body.line1,
    city: req.body.city,
    country: req.body.country,
    line2: req.body.line2,
    postal_code: req.body.postalCode,
    state: req.body.state
  }
  try {
    const { stripeCustomerId } = req.user; //MAYBE MOVE THIS TO BODY
    let result;
    let card;
    let newCustomer = true;

    //New customer
    if (!stripeCustomerId) {
      result = await stripe.customers.create(params);
      if (result && result.sources && result.sources.data && result.sources.data.length) {
        card = result.sources.data[0];
      } else {
        return res.status(422).send(httpUtil.createResponse(422, "ERROR :  Unable to add credit card to account."));
      }
    }
    //Existing customer, adds new card
    else {
      delete params.email;
      result = await stripe.customers.createSource(stripeCustomerId, params);
      card = result;
      newCustomer = false;
    }

    if (card.exp_month < 10) card.exp_month = '0' + card.exp_month;

    let updateExpression = 'set #stripeBillingCardBrand = :stripeBillingCardBrand, #stripeBillingCardExp = :stripeBillingCardExp';
    updateExpression += ', #stripeBillingCardLast4 = :stripeBillingCardLast4';
    updateExpression += ', #stripeCardId = :stripeCardId, #shippingAddressLine1 = :shippingAddressLine1, #shippingAddressCity = :shippingAddressCity';
    updateExpression += ', #shippingAddressCountry = :shippingAddressCountry, #shippingAddressLine2 = :shippingAddressLine2';
    updateExpression += ', #shippingAdddressPostalCode = :shippingAdddressPostalCode, #shippingAddressState = :shippingAddressState';
    if (newCustomer === true) updateExpression += ', #stripeCustomerId = :stripeCustomerId'

    let updateRequest = {
      TableName: userTable,
      Key: {
        userId: req.user.userId
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: {
        '#stripeBillingCardBrand': 'stripeBillingCardBrand', '#stripeBillingCardExp': 'stripeBillingCardExp',
        '#stripeBillingCardLast4': 'stripeBillingCardLast4', '#stripeCustomerId': 'stripeCustomerId', '#stripeCardId': 'stripeCardId',
        '#shippingAddressLine1': 'shippingAddressLine1', '#shippingAddressCity': 'shippingAddressCity', '#shippingAddressCountry': 'shippingAddressCountry',
        '#shippingAddressLine2': 'shippingAddressLine2', '#shippingAdddressPostalCode': 'shippingAdddressPostalCode', '#shippingAddressState': 'shippingAddressState'
      },
      ExpressionAttributeValues: {
        ':stripeBillingCardBrand': card.brand,
        ':stripeBillingCardExp': card.exp_month + '/' + card.exp_year,
        ':stripeBillingCardLast4': card.last4,
        ':stripeCustomerId': result.id,
        ':stripeCardId': card.id,
        ':shippingAddressLine1': req.body.line1 || ' ',
        ':shippingAddressCity': req.body.city || ' ',
        ':shippingAddressCountry': req.body.country || ' ',
        ':shippingAddressLine2': req.body.country || ' ',
        ':shippingAdddressPostalCode': req.body.postalCode || ' ',
        ':shippingAddressState': req.body.state || ' '
      },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnValues: 'UPDATED_NEW'
    };
    if (newCustomer === false) {
      delete updateRequest.ExpressionAttributeNames['#stripeCustomerId'];
      delete updateRequest.ExpressionAttributeValues[':stripeCustomerId'];
    }

    try {
      //update the user in DB with relevant card info
      let updatedUser = await docClient.update(updateRequest).promise();
      //Checks to see if update worked
      if (updatedUser.Attributes.stripeCardId === card.id) {
        return res.status(200).send(httpUtil.createResponse(200, "SUCCESS : Card added."));
      }
      else {
        console.log("**ERROR** Dynamo update failed.")
        return res.status(500).send(httpUtil.createResponse(500, "ERROR : Adding card failed."));
      }
    }
    catch (err) {
      console.log('**ERROR** Couldn\'t update user in DB.**', err);
      return res.status(500).send(httpUtil.createResponse(500, "ERROR : Couldn't update user in DB."));
    }
  }
  catch (err) {
    console.log('**ERROR** Issue with stripe result.** ', err);
    return res.status(500).send(httpUtil.createResponse(500, "ERROR :  Issue with stripe result."));
  }
};
