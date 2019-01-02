const stripe = require("./stripeInstance");
const { updateUserById } = require("../utils/mongoUser");

module.exports.handler = function(req, res) {
  const { stripeCustomerId } = req.user;
  if (!stripeCustomerId) {
    //TODO: allow user to update card, or delete it
    //right now, just return 500 if they already have a card
    return res.status(500).send("User has no card on file, can't delete card");
  }

  //delete user as customer in stripe
  stripe.customers
    .del(stripeCustomerId)
    .then(async () => {
      const blankBillingInfo = {
        stripeBillingCardBrand: "",
        stripeBillingCardExpMonth: null,
        stripeBillingCardExpYear: null,
        stripeBillingCardLast4: null,
        stripeCustomerId: ""
      };

      //update user in our DB with no card info
      await updateUserById(req.user._id, blankBillingInfo);
      res.send("Card deleted!");
    })
    .catch(err => {
      res.status(500).send("A problem occurred deleting card");
    });
};
