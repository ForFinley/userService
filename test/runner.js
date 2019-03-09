const { startDynamoLocal, createTables, createRecords, stopDynamoLocal } = require('./dynamodbLocal.js');
const { registrationTests } = require('./userService/registration/registration.test.js');

describe('** All Integrated Tests **', () => {

  before(async () => {
    startDynamoLocal();
    await createTables();
    // await createRecords();
  });

  after(stopDynamoLocal);

  describe('Registration', () => {
    registrationTests();
  });

});
