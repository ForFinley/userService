const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    salt: String,
<<<<<<< HEAD
    emailVerified: Boolean,
    emailVerificationHash: String
=======
    emailVerified: Boolean
>>>>>>> 2c34576b9f725d7aa696e8ae492017225b0d9953

});
const User = mongoose.model("users", userSchema);

module.exports = User;
