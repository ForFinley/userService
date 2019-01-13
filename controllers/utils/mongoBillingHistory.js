const mongoose = require("mongoose");
const mongoBillingHistory = require("../../models/billingHistory.js");

function queryBillingHistoryByUserId(userId) {
  return new Promise((resolve, reject) => {
    mongoBillingHistory.find({ userId: userId }, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    }).sort({ transactionDate: -1 });
  });
}

function putBillingHistory(obj) {
  let billingHistory = new mongoBillingHistory(obj);
  return new Promise((resolve, reject) => {
    billingHistory.save(function (err, billingHistory) {
      if (err) {
        return reject(err);
      }
      resolve({ message: "DATA PUT INTO DATABASE.", billingHistory: billingHistory });
    });
  });
}

module.exports = {
  queryBillingHistoryByUserId,
  putBillingHistory
};

// mongoBillingHistory.find(function (err, collection) {
//   if (err) {
//     return reject(err);
//   }
//   console.log(collection);
// });

// mongoBillingHistory.deleteOne({ _id: "5c3ba2df29971f2f246894b6" }, (err, result) => {
//   if (err) return console.error(err);
//   console.log(result);
// });
