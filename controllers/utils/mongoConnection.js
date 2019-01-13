const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/local",
  { useNewUrlParser: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.on("open", () => console.log("Connnected to MongoDB."));

module.exports = db;