const mongoose = require("mongoose");
const mongoUser = require("../../models/users.js");

mongoose.connect(
  "mongodb://localhost:27017/local",
  { useNewUrlParser: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.on("open", () => console.log("Connnected to MongoDB."));

function queryAllUsers() {
  return new Promise((resolve, reject) => {
    mongoUser.find(function (err, collection) {
      if (err) {
        return reject(err);
      }
      resolve(collection);
    });
  });
}

function queryUserByEmail(email) {
  return new Promise((resolve, reject) => {
    mongoUser.findOne({ email: email }, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

function queryUserById(id) {
  return new Promise((resolve, reject) => {
    mongoUser.findOne({ _id: id }, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

function putUser(obj) {
  let user = new mongoUser(obj);
  return new Promise((resolve, reject) => {
    user.save(function (err, user) {
      if (err) {
        return reject(err);
      }
      resolve({ message: "DATA PUT INTO DATABASE.", user: user });
    });
  });
}

function updateUserByEmail(email, changes) {
  return new Promise((resolve, reject) => {
    mongoUser.updateOne({ email: email }, { $set: changes }, function (
      err,
      result
    ) {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

function updateUserById(id, changes) {
  return new Promise((resolve, reject) => {
    mongoUser.updateOne({ _id: id }, { $set: changes }, function (err, result) {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

module.exports = {
  queryAllUsers,
  queryUserByEmail,
  queryUserById,
  putUser,
  updateUserByEmail,
  updateUserById
};

queryAllUsers().then(d => {
  console.log(d);
});

// mongoUser.deleteOne({ _id: "5c36b04ba9e3d43a68b404ea" }, (err, result) => {
//   if (err) return console.error(err);
//   console.log(result);
// });

// mongoUser.updateOne({ _id: '5c36c78c19a9a73e3c3753ef' }, { $set: { stripeCustomerId: "" } }, function (err, result) { //{role: "ADMIN"}
//   if (err) return console.error(err);
//   console.log(result);
// });
