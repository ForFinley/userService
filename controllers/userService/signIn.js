const jwtUtil = require("../utils/jwt.js");

module.exports.handler = (req, res) => {
  console.log("Starting function signIn...");
  console.log(req.user)
  let user = {
    _id: req.user._id,
    email: req.user.email,
  }
  const token = jwtUtil.generateToken(req.user);
  res.status(200).json({
    user: user,
    token: token
  });
};
