const stripe = require("./stripeInstance");
const { updateUserById } = require("../utils/mongoUser");
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
  console.log(params);
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
        return res.status(422).send("ERROR : Unable to add credit card to account.");
      }
    }
    //Existing customer, adds new card
    else {
      delete params.email;
      result = await stripe.customers.createSource(stripeCustomerId, params);
      card = result;
      newCustomer = false;
    }
    console.log(result);

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
    if (newCustomer === false) delete changes.stripeCustomerId;

    try {
      //update the user in DB with relevant card info
      let updatedUser = await updateUserById(req.user._id, changes);
      console.log("updatedUser: ", updatedUser);
      return res.status(200).send("Credit card added!");
    }
    catch (err) {
      console.log('**ERROR** Couldn\'t update user in DB.**', err);
      return res.status(500).send("ERROR : Couldn't update user in DB.");
    }
  }
  catch (err) {
    console.log('**ERROR** Issue with stripe result.** ', err);
    return res.status(500).send("ERROR : Issue with stripe result.");
  }
};
