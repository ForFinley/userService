const dynamodbLocal = require('dynamodb-localhost');
const { dynamodb, docClient } = require('../controllers/utils/dynamoSetup.js');
const { USER_TABLE } = require('../env.js');
const port = 8000;

// dynamodbLocal.remove(() => { });

exports.startDynamoLocal = () => {
  dynamodbLocal.install(() => {});
  dynamodbLocal.start({ port, inMemory: true });
};

exports.stopDynamoLocal = () => {
  dynamodbLocal.stop(port);
};

exports.createTables = async () => {
  const params = {
    AttributeDefinitions: [
      {
        AttributeName: 'userId',
        AttributeType: 'S'
      },
      {
        AttributeName: 'email',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'userId',
        KeyType: 'HASH'
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    },
    GlobalSecondaryIndexes: [
      {
        IndexName: 'email-index',
        KeySchema: [
          {
            AttributeName: 'email',
            KeyType: 'HASH'
          }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    TableName: USER_TABLE
  };

  try {
    await dynamodb.createTable(params).promise();
    const tables = await dynamodb.listTables({}).promise();
    console.log('TABLE CREATED:', tables);
  } catch (e) {
    console.log(e);
  }
};

exports.createRecords = async () => {
  //For getWatchHistory test - Should get user watch history
  const { getVideoHistory } = require('./getWatchHistory/fixtures.js');
  const {
    deleteSingleVideo,
    deleteMultipleVideos
  } = require('./deleteWatchHistory/fixtures.js');

  const paramsEpisode = {
    TableName: USER_TABLE,
    Item: {
      userId: getVideoHistory.pathParameters.userId,
      sortKey: `EPISODE#${getVideoHistory.queryStringParameters.seriesId}#${
        getVideoHistory.nockVideoId
      }`,
      videoId: getVideoHistory.nockVideoId,
      seriesId: getVideoHistory.queryStringParameters.seriesId,
      hide: false,
      recordType: 'EPISODE',
      updateDate: '2018-03-13T20:43:25.115Z',
      watchedTime: 30,
      watchedPercentage: 2,
      completed: false
    },
    ReturnConsumedCapacity: 'TOTAL'
  };
  //For getWatchHistory test - Should get user series watch history
  const paramsLatest = {
    TableName: USER_TABLE,
    Item: {
      userId: getVideoHistory.pathParameters.userId,
      sortKey: `LATEST_EPISODE#${
        getVideoHistory.queryStringParameters.seriesId
      }`,
      videoId: getVideoHistory.nockVideoId,
      seriesId: getVideoHistory.queryStringParameters.seriesId,
      hide: false,
      recordType: 'LATEST_EPISODE',
      updateDate: '2018-03-13T20:43:25.115Z',
      watchedTime: 30,
      watchedPercentage: 2,
      completed: false
    },
    ReturnConsumedCapacity: 'TOTAL'
  };

  const paramsDeleteEpisode = {
    TableName: USER_TABLE,
    Item: {
      userId: deleteSingleVideo.pathParameters.userId,
      sortKey: `EPISODE#${deleteSingleVideo.queryStringParameters.seriesId}#${
        deleteSingleVideo.queryStringParameters.videoIds
      }`,
      videoId: deleteSingleVideo.queryStringParameters.videoIds,
      hide: false,
      recordType: 'EPISODE',
      updateDate: '2018-03-13T20:43:25.115Z',
      watchedTime: 30,
      watchedPercentage: 15,
      completed: false
    },
    ReturnConsumedCapacity: 'TOTAL'
  };

  const paramsDeleteAll1 = {
    TableName: USER_TABLE,
    Item: {
      userId: deleteMultipleVideos.pathParameters.userId,
      sortKey: `EPISODE#${
        deleteMultipleVideos.queryStringParameters.seriesId
      }#1`,
      videoId: '1',
      hide: false,
      recordType: 'EPISODE',
      updateDate: '2018-03-13T20:43:25.115Z',
      watchedTime: 120,
      watchedPercentage: 24,
      completed: false
    },
    ReturnConsumedCapacity: 'TOTAL'
  };

  const paramsDeleteAll2 = {
    TableName: USER_TABLE,
    Item: {
      userId: deleteMultipleVideos.pathParameters.userId,
      sortKey: `EPISODE#${
        deleteMultipleVideos.queryStringParameters.seriesId
      }#2`,
      videoId: '2',
      hide: false,
      recordType: 'EPISODE',
      updateDate: '2018-03-13T20:43:25.115Z',
      watchedTime: 660,
      watchedPercentage: 93,
      completed: false
    },
    ReturnConsumedCapacity: 'TOTAL'
  };

  const paramsDeleteAll3 = {
    TableName: USER_TABLE,
    Item: {
      userId: deleteMultipleVideos.pathParameters.userId,
      sortKey: `EPISODE#${
        deleteMultipleVideos.queryStringParameters.seriesId
      }#3`,
      videoId: '3',
      hide: false,
      recordType: 'EPISODE',
      updateDate: '2018-03-13T20:43:25.115Z',
      watchedTime: 30,
      watchedPercentage: 15,
      completed: false
    },
    ReturnConsumedCapacity: 'TOTAL'
  };

  const paramsDeleteAllLatest = {
    TableName: USER_TABLE,
    Item: {
      userId: deleteMultipleVideos.pathParameters.userId,
      sortKey: `LATEST_EPISODE#${
        deleteMultipleVideos.queryStringParameters.seriesId
      }#3`,
      videoId: '3',
      hide: false,
      recordType: 'EPISODE',
      updateDate: '2018-03-13T20:43:25.115Z',
      watchedTime: 30,
      watchedPercentage: 15,
      completed: false
    },
    ReturnConsumedCapacity: 'TOTAL'
  };

  let arr = [
    docClient.put(paramsEpisode).promise(),
    docClient.put(paramsLatest).promise(),
    docClient.put(paramsDeleteEpisode).promise(),
    docClient.put(paramsDeleteAll1).promise(),
    docClient.put(paramsDeleteAll2).promise(),
    docClient.put(paramsDeleteAll3).promise(),
    docClient.put(paramsDeleteAllLatest).promise()
  ];
  await Promise.all(arr);

  console.log('TEST RECORDS CREATED');

  // let t = await docClient.query({
  //   TableName, KeyConditionExpression:
  //     "userId = :userId",
  //   ExpressionAttributeValues:
  //     ":userId": getUserHistory.pathParameters.userId
  //   }
  // }).promise();
  // console.log("HUR", t)
};
