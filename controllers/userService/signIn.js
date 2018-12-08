const passportFunctions = require("./passport");

module.exports.handler = (req, res) => {
  const token = passportFunctions.generateToken(req.user);
  res.status(200).json({
    user: req.user,
    token: token
  });
};
