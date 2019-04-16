const dynamodbLocal = require('dynamodb-localhost');
const { dynamodb, docClient } = require('../controllers/utils/dynamoSetup.js');
const { USER_TABLE, REFRESH_TABLE } = require('../env.js');
const port = 8000;

exports.startDynamoLocal = async () => {
  dynamodbLocal.install(() => {});
  dynamodbLocal.start({ port, inMemory: true });
};

exports.stopDynamoLocal = () => {
  dynamodbLocal.stop(port);
};

exports.createTables = async () => {
  const paramsUserTable = {
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
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
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
          ReadCapacityUnits: 10,
          WriteCapacityUnits: 10
        }
      }
    ],
    TableName: USER_TABLE
  };

  const paramsRefreshTable = {
    AttributeDefinitions: [
      {
        AttributeName: 'refreshToken',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'refreshToken',
        KeyType: 'HASH'
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    },
    TableName: REFRESH_TABLE
  };

  try {
    await dynamodb.createTable(paramsUserTable).promise();
    await dynamodb.createTable(paramsRefreshTable).promise();
    const tables = await dynamodb.listTables({}).promise();
    console.log('TABLE CREATED:', tables);
  } catch (e) {
    console.log(e);
  }
};

exports.createRecords = async () => {
  const {
    registerNewUserExistingEmail
  } = require('./registration/fixtures.js');
  const {
    signInUser,
    signInExistingUserGoogle,
    signInExistingFBUserWithGoogle
  } = require('./signIn/fixtures.js');
  const { verifyEmail } = require('./verifyEmail/fixtures.js');
  const { changePassword } = require('./changePassword/fixtures.js');
  const {
    resetPasswordInit,
    resetPasswordConfirm
  } = require('./passwordReset/fixtures.js');
  const {
    changeEmailRecord,
    changeEmailInUseRecord
  } = require('./changeEmail/fixtures.js');
  const { profileRecord } = require('./profile/fixtures.js');
  const { refreshRecord } = require('./refresh/fixtures.js');
  const { signOutFixture } = require('./signOut/fixtures.js');

  const registerNewUserExistingEmailParams = {
    TableName: USER_TABLE,
    Item: {
      userId: registerNewUserExistingEmail.userId,
      email: registerNewUserExistingEmail.body.email,
      password: registerNewUserExistingEmail.body.password
    }
  };

  const signInUserRecord = {
    TableName: USER_TABLE,
    Item: {
      userId: signInUser.userId,
      email: signInUser.body.email,
      password: signInUser.encrytPassword,
      salt: signInUser.salt
    }
  };

  const signInUserGoogleRecord = {
    TableName: USER_TABLE,
    Item: {
      userId: signInExistingUserGoogle.userId,
      email: signInExistingUserGoogle.googleResponseExistingUser.email,
      provider: 'google'
    }
  };

  const signInUserFBUSerWithGoogleRecord = {
    TableName: USER_TABLE,
    Item: {
      userId: signInExistingFBUserWithGoogle.userId,
      email: signInExistingFBUserWithGoogle.googleResponseExistingUser.email,
      provider: 'facebook'
    }
  };

  const verifyEmailParams = {
    TableName: USER_TABLE,
    Item: {
      userId: verifyEmail.userId,
      email: verifyEmail.email,
      emailVerified: false
    }
  };

  const changePasswordParams = {
    TableName: USER_TABLE,
    Item: {
      userId: changePassword.user.userId,
      password: changePassword.encryptPass,
      salt: changePassword.salt
    }
  };

  const resetPasswordInitParams = {
    TableName: USER_TABLE,
    Item: {
      userId: resetPasswordInit.userId,
      email: resetPasswordInit.body.email
    }
  };

  const resetPasswordConfirmParams = {
    TableName: USER_TABLE,
    Item: {
      userId: resetPasswordConfirm.userId,
      email: resetPasswordConfirm.email,
      password: resetPasswordConfirm.oldPassword,
      salt: resetPasswordConfirm.salt
    }
  };

  const changeEmailParams = {
    TableName: USER_TABLE,
    Item: {
      userId: changeEmailRecord.userId,
      email: changeEmailRecord.email
    }
  };

  const changeEmailInUseParams = {
    TableName: USER_TABLE,
    Item: {
      userId: changeEmailInUseRecord.userId,
      email: changeEmailInUseRecord.email
    }
  };

  const profileParams = {
    TableName: USER_TABLE,
    Item: {
      userId: profileRecord.userId,
      email: profileRecord.email,
      billingAddress: profileRecord.billingAddress,
      creditCard: profileRecord.creditCard,
      emailVerified: 'false'
    }
  };

  const refreshParams = {
    TableName: REFRESH_TABLE,
    Item: {
      refreshToken: refreshRecord.refreshToken,
      userId: refreshRecord.userId,
      userAgent: refreshRecord.userAgent,
      addedDate: new Date().toISOString()
    }
  };

  const refreshUserParams = {
    TableName: USER_TABLE,
    Item: {
      userId: refreshRecord.userId,
      email: refreshRecord.email,
      role: refreshRecord.role
    }
  };

  const refreshSignOutParams = {
    TableName: REFRESH_TABLE,
    Item: {
      userId: signOutFixture.userId,
      refreshToken: signOutFixture.headers.authorization
    }
  };

  const fixtureArray = [
    registerNewUserExistingEmailParams,
    signInUserRecord,
    signInUserGoogleRecord,
    signInUserFBUSerWithGoogleRecord,
    verifyEmailParams,
    changePasswordParams,
    resetPasswordInitParams,
    resetPasswordConfirmParams,
    changeEmailParams,
    changeEmailInUseParams,
    profileParams,
    refreshParams,
    refreshUserParams,
    refreshSignOutParams
  ];
  await Promise.all(fixtureArray.map(param => docClient.put(param).promise()));
  console.log('TEST RECORDS CREATED');

  // let t = await docClient
  //   .scan({
  //     TableName: USER_TABLE
  //   })
  //   .promise();
  // console.log('HUR', t);
};

exports.userInDynamo = async userId => {
  const params = {
    TableName: USER_TABLE,
    Key: { userId }
  };
  const result = await docClient.get(params).promise();
  if (result.Item && result.Item.userId) return true;
  return false;
};

exports.getUser = async userId => {
  const params = {
    TableName: USER_TABLE,
    Key: { userId }
  };
  const result = await docClient.get(params).promise();
  if (result.Item && result.Item.userId) return result.Item;
  return false;
};

exports.getRefreshToken = async refreshToken => {
  const params = {
    TableName: REFRESH_TABLE,
    Key: { refreshToken }
  };
  const result = await docClient.get(params).promise();
  if (result.Item && result.Item.refreshToken) return result.Item;
  return false;
};
