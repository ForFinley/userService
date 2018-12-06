const mongoose = require('mongoose');
const mongoUser = require('../models/users.js');

mongoose.connect("mongodb://localhost:27017/local", { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', () => console.log("Connnected to MongoDB."));


function queryAllUsers() {
  return new Promise((resolve, reject) => {
    mongoUser.find(function (err, collection) {
      if (err) reject(err);
      resolve(collection);
    });
  });
}

function queryUserByusername(username) {
  return new Promise((resolve, reject) => {
    mongoUser.findOne({ username: username }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

function putUser(obj) {
  let user = new mongoUser(obj);
  return new Promise((resolve, reject) => {
    user.save(function (err, user) {
      if (err) reject(err);
      resolve({ message: "DATA PUT INTO DATABASE.", user: user });
    });
  });
}

function updateUser(username, changes) {
  return new Promise((resolve, reject) => {
    mongoUser.updateOne({ username: username }, { $set: changes }, function (err, result) {
      if (err) reject(err);
      else resolve(result);
    });
  });

}

module.exports = {
  queryAllUsers,
  queryUserByusername,
  putUser,
  updateUser
}

queryAllUsers().then((d) => {
  console.log(d);
});

mongoUser.deleteOne({ _id: "5c09545e7241b11299058bb3" }, (err, result) => { //deleteMany
  if (err) return console.error(err);
  console.log(result);
});





