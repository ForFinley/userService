const mongoose = require("mongoose");

const billingHistorySchema = new mongoose.Schema({
  userId: String,
  productId: String,
  stripeChargeId: String,
  price: Number,
  currency: String, //USD
  transactionDate: String,
  paymentHandler: String, //STRIPE
  cardBrand: String,
  cardLastFour: String,
  cardExpiration: String,
  shippingAddressLine1: String,
  shippingAddressCity: String,
  shippingAddressCountry: String,
  shippingAddressLine2: String,
  shippingAdddressPostalCode: String,
  shippingAddressState: String,
  paymentChargeType: String // CHARGE (chargeInfo.object)

});

const BillingHistory = mongoose.model("billingHistory", billingHistorySchema);

module.exports = BillingHistory;