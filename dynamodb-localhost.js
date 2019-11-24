require('dotenv').config();
const dynamodbLocal = require('dynamodb-localhost');
const { createTables } = require('./test/dynamodbLocal');

(async function() {
  dynamodbLocal.install(() => {});
  dynamodbLocal.start({ port: 8000 });
  await createTables();
})();
