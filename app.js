require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const Strategy = require("passport-local");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const passportFunctions = require("./controllers/utils/passport.js");

const app = express();
const PORT = 4000;

const index = require("./routes/index.js");
const userService = require("./routes/userService.js");
const admin = require("./routes/admin.js");
const payment = require("./routes/payment");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
passport.use(
  new Strategy({ usernameField: "email" }, passportFunctions.passportStrategy)
);

app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter); //  apply to all requests

app.use("/", index);
app.use("/userService", userService);
app.use("/admin", admin);
app.use("/payment", payment);

let server = app.listen(PORT, () => {
  console.log("server running at " + PORT);
});

module.exports = app;
