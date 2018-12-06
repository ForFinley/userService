const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    salt: String,
    emailVerified: Boolean,
    emailVerificationHash: String

});
const User = mongoose.model("users", userSchema);

module.exports = User;
