require('dotenv').config();
const dynamodbLocal = require('dynamodb-localhost');
const { createTables } = require('./dynamodbLocal');
const { DYNAMODB_PORT } = process.env;

(async function() {
  dynamodbLocal.install(() => {});
  dynamodbLocal.start({ port: DYNAMODB_PORT });
  await createTables();
})();
