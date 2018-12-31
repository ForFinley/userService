const stripe = require("./stripeInstance");
const { updateUserById } = require("../utils/mongoUser");

module.exports.handler = async function(req, res) {
  const { stripeCustomerId } = req.user;
  if (stripeCustomerId) {
    //TODO: allow user to update card, or delete it
    //right now, just return 500 if they already have a card
    return res.status(500).send("User already has a card on file");
  }

  //check for token (that comes from stripe on the client request)
  const token = req.body.token;
  if (token) {
    try {
      const customer = await stripe.customers.create({
        email: req.user.email,
        source: token
      });

      if (
        customer &&
        customer.sources &&
        customer.sources.data &&
        customer.sources.data.length
      ) {
        const card = customer.sources.data[0];
        console.log(card);
        const changes = {
          stripeBillingCardBrand: card.brand,
          stripeBillingCardExpMonth: card.exp_month,
          stripeBillingCardExpYear: card.exp_year,
          stripeBillingCardLast4: card.last4,
          stripeCustomerId: customer.id
        };

        try {
          //update the user in DB with relevant card info
          const newUser = await updateUserById(req.user._id, changes);
          return res.send("Credit card added!");
        } catch (err) {
          res.status(500).send("Couldnt update user in DB");
        }
      } else {
        res.status(422).send("Unable to add credit card to account");
      }
    } catch (err) {
      res.status(500).send("Issue with stripe customer");
    }
  } else {
    res.status(422).send('Missing "token" parameter');
  }
};
