const mongoose = require("mongoose");
const mongoProduct = require("../../models/products.js");

function queryAllProducts() {
  return new Promise((resolve, reject) => {
    mongoProduct.find(function (err, collection) {
      if (err) {
        return reject(err);
      }
      resolve(collection);
    });
  });
}

function queryProductById(id) {
  return new Promise((resolve, reject) => {
    mongoProduct.findOne({ _id: id }, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

module.exports = {
  queryAllProducts,
  queryProductById
};

queryAllProducts().then(d => {
  console.log("PRODUCTS: \n", d);
});


// let product = new mongoProduct({
//   name: "Burrito",
//   price: 9.99,
//   description: "Tasty, delicous, let me put it in my mouth.",
//   currency: "USD"
// });
// product.save(function (err, product) {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log(product);
//   }
// });


// mongoProduct.deleteOne({ _id: "5c3abea48203bd41d095022a" }, (err, result) => {
//   if (err) return console.error(err);
//   console.log(result);
// });

// mongoProduct.updateOne({ _id: '5c3abe7ddad0194214a68224' }, { $set: { price: 10.99 } }, function (err, result) {
//   if (err) return console.error(err);
//   console.log(result);
// });