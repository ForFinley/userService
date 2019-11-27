require('dotenv').config();
const dynamodbLocal = require('dynamodb-localhost');
const { createTables } = require('./test/dynamodbLocal');
const { DYNAMODBPORT } = process.env;

(async function() {
  dynamodbLocal.install(() => {});
  dynamodbLocal.start({ port: DYNAMODBPORT });
  await createTables();
})();
