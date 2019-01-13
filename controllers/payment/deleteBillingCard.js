const stripe = require("./stripeInstance");
const { updateUserById } = require("../utils/mongoUser");
/**
 * Reference: https://stripe.com/docs/api/sources/detach
 */

module.exports.handler = async function (req, res) {
  console.log("Starting function deleteBillingCard...");
  console.log(req.user);

  const { stripeCustomerId } = req.user;
  if (!stripeCustomerId && !stripeCardId) {
    return res.status(500).send("User has no card on file, can't delete.");
  }

  try {
    const result = await stripe.customers.deleteSource(req.user.stripeCustomerId, req.user.stripeCardId);
    console.log(result);

    // update user in our DB with no card info
    const blankBillingInfo = {
      stripeBillingCardBrand: "", //WHYYYY NOT NULLL????
      stripeBillingCardExpMonth: null,
      stripeBillingCardExpYear: null,
      stripeBillingCardLast4: null,
      stripeCardId: ""
    };
    await updateUserById(req.user._id, blankBillingInfo);
    return res.status(200).send("Card deleted!");
  }
  catch (err) {
    console.log('**ERROR** A problem occurred while attempting to delete card.**', err);
    return res.status(500).send("ERROR : A problem occurred while attempting to delete card.");
  }
};
