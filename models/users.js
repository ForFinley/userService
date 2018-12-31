const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  salt: String,
  emailVerified: Boolean,
  role: String,
  stripeCustomerId: String,
  stripeBillingCardBrand: String,
  stripeBillingCardExpMonth: Number,
  stripeBillingCardExpYear: Number,
  stripeBillingCardLast4: Number
});

userSchema.virtual("publicProperties").get(function() {
  return {
    email: this.email,
    emailVerified: this.emailVerified,
    role: this.role,
    stripeBillingCardBrand: this.stripeBillingCardBrand,
    stripeBillingCardExpMonth: this.stripeBillingCardExpMonth,
    stripeBillingCardExpYear: this.stripeBillingCardExpYear,
    stripeBillingCardLast4: this.stripeBillingCardLast4
  };
});

const User = mongoose.model("users", userSchema);

module.exports = User;
