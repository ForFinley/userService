// const stripe = require("./stripeInstance");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { updateUserById } = require("../utils/mongoUser");

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
    const customer = await stripe.customers.create({ params });
    if (customer && customer.sources && customer.sources.data && customer.sources.data.length) {
      const card = customer.sources.data[0];
      const changes = {
        stripeBillingCardBrand: card.brand,
        stripeBillingCardExpMonth: card.exp_month,
        stripeBillingCardExpYear: card.exp_year,
        stripeBillingCardLast4: card.last4,
        stripeCustomerId: customer.id,
        shippingAddressLine1: req.body.line1,
        shippingAddressCity: req.body.city,
        shippingAddressCountry: req.body.country,
        shippingAddressLine2: req.body.line2,
        shippingAdddressPostalCode: req.body.postalCode,
        shippingAddressState: req.body.state
      };

      try {
        //update the user in DB with relevant card info
        await updateUserById(req.user._id, changes);
        return res.send("Credit card added!");
      } catch (err) {
        res.status(500).send("ERROR : Couldnt update user in DB");
      }
    } else {
      res.status(422).send("ERROR : Unable to add credit card to account");
    }
  } catch (err) {
    res.status(500).send("ERROR : Issue with stripe customer");
  }

};
