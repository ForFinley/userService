const AWS = require('aws-sdk');
const { REGION, NODE_ENV } = process.env;

let config = {
  region: REGION || 'us-east-1'
};

if (NODE_ENV === 'TEST' || NODE_ENV === 'LOCAL') {
  config = Object.assign(config, {
    endpoint: new AWS.Endpoint('http://localhost:8000'),
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey'
  });
}

AWS.config.update(config);

const docClient = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });
const dynamodb = new AWS.DynamoDB();

module.exports = {
  AWS,
  docClient,
  dynamodb
};
