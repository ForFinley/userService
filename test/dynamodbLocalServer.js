require('dotenv').config();
const dynamodbLocal = require('dynamodb-localhost');
const { createTables } = require('./dynamodbLocal');

const { DYNAMODB_PORT } = process.env;

// eslint-disable-next-line wrap-iife
(async () => {
  dynamodbLocal.install(() => {});
  dynamodbLocal.start({ port: DYNAMODB_PORT });
  await createTables();
})();
