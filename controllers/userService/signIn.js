const jwtUtil = require("../utils/jwt.js");

module.exports.handler = (req, res) => {
  console.log("Starting function signIn...");
  console.log(req.user);
  let user = {
    userId: req.user.userId,
    email: req.user.email,
  }
  const token = jwtUtil.generateToken(req.user);
  res.status(200).json({
    user: user,
    token: token
  });
};
