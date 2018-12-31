const { queryUserById } = require("./mongoUser");

//this middleware meant to go after 'authenticate' middleware
//so req.user._id is already defined
module.exports = async (req, res, next) => {
  if (!req.user._id) {
    return res.status(500).send("No user _id provided");
  }
  try {
    const userFromDB = await queryUserById(req.user._id);

    //add full user to req.user
    req.user = userFromDB;

    return next();
  } catch (e) {
    return res
      .status(500)
      .send({ error: e, message: "An error occurred finding user" });
  }
};
