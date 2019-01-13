const { queryBillingHistoryByUserId } = require("../utils/mongoBillingHistory");


module.exports.handler = async function (req, res) {
  console.log("Starting function getUserBillingHistory...");
  console.log(req.user);

  try {
    let billingHistory = await queryBillingHistoryByUserId(req.user._id);
    return res.status(200).send(billingHistory);
  }
  catch (err) {
    console.log('**ERROR**', err);
    return res.status(500).send("ERROR : Querying billing history failed.");
  }

};