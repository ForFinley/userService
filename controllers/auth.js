//https://medium.com/hyphe/token-based-authentication-in-node-6e8731bfd7f2
//https://medium.com/hyphe/using-refresh-tokens-in-node-to-stay-authenticated-ad0c9d2b444f

///////////////////
// configuration //
///////////////////
const PORT = 3000;
const SECRET = 'server secret';
const TOKENTIME = 1 * 60; // in seconds

/////////////
// modules //
/////////////
const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');
const expressJwt = require('express-jwt');
const http = require('http');
const jwt = require('jsonwebtoken');
const logger = require('morgan');
const passport = require('passport');
const Strategy = require('passport-local');

const db = require('./dbDummy');
// const database = require('./utils/mongoUser.js');
const passwordUtil = require('./utils/crypto.js');

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
const userTable = "users"

const app = express();
const authenticate = expressJwt({
  secret: SECRET
});


//////////////
// passport //
//////////////
passport.use(new Strategy(
  async function (email, password, done) {
    email = email.trim().toLowerCase();
    // let user = await database.queryUserByEmail(email);
    let user = await docClient.query({
      TableName: userTable,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      },
      ReturnConsumedCapacity: 'TOTAL'
    }).promise();

    if (user.Count > 0) {
      emailBool = false;
      if (passwordUtil.checkPassword(password, user.Items[0].password, user.Items[0].salt)) {
        done(null, user.Items[0]);
      }
      else done(null, false);
    }
    else done(null, false);
  }
));

////////////
// helper //
////////////

function serializeUser(req, res, next) {
  console.log("serializeUser", req.user);
  // we store information needed in token in req.user
  req.user = {
    userId: req.user.userId,
    username: req.user.email,
    role: req.user.role,
    // clients: req.user.clients
  };
  next();
}

async function serializeClient(req, res, next) {
  console.log("serializeClient", req.user);
  if (req.query.permanent === 'true') {
    try {

      let clients = req.user.clients || [];

      if (!refreshTokenInDB(clients, req.body.ip)) clients.push({ id: req.body.ip });

      // let result = await database.updateUserById(req.user._id, { clients: clients });
      let result = await docClient.update({
        TableName: userTable,
        Key: {
          userId: req.user.userId
        },
        UpdateExpression: 'set #clients = :clients',
        ExpressionAttributeNames: {
          '#clients': 'clients'
        },
        ExpressionAttributeValues: {
          ':clients': clients
        },
        ReturnConsumedCapacity: 'TOTAL',
        ReturnValues: 'UPDATED_NEW'
      }).promise();

      console.log("serializeClient result: ", result);
      req.user.clientId = req.body.ip;
      next();
    }
    catch (e) {
      console.log("**ERROR**", e);
      return;
    }
  } else {
    next();
  }
}

async function validateRefreshToken(req, res, next) {
  // let user = await database.queryUserById(req.body._id);
  let user = await docClient.get({
    TableName: userTable,
    Key: {
      userId: req.body.userId
    },
    ReturnConsumedCapacity: 'TOTAL'
  }).promise();

  let clientId = 0;
  for (let x = 0; x < user.Item.clients.length; x++) {
    if (user.Item.clients[x].refreshToken === req.body.refreshToken) {
      clientId = user.Item.clients[x].id;
      //delete refresh token
      user.Item.clients.splice(x, 1);
      // database.putUser(user);
      let result = await docClient.update({
        TableName: userTable,
        Key: {
          userId: req.body.userId
        },
        UpdateExpression: 'set #clients = :clients',
        ExpressionAttributeNames: {
          '#clients': 'clients'
        },
        ExpressionAttributeValues: {
          ':clients': user.Item.clients
        },
        ReturnConsumedCapacity: 'TOTAL',
        ReturnValues: 'UPDATED_NEW'
      }).promise();
    }
  }
  req.user = {
    userId: req.body.userId,
    clientId: clientId
  }
  next();
}

function rejectToken(req, res, next) {
  db.client.rejectToken(req.body, next);
}

//////////////////////
// token generation //
//////////////////////
function generateAccessToken(req, res, next) {
  req.token = req.token || {};
  req.token.accessToken = jwt.sign({
    id: req.user.userId,
    clientId: req.user.clientId
  }, SECRET, {
      expiresIn: TOKENTIME
    });
  next();
}

async function generateRefreshToken(req, res, next) {
  if (req.query.permanent === 'true') {
    req.token.refreshToken = req.user.clientId.toString() + '.' + crypto.randomBytes(
      40).toString('hex');

    // let user = await database.queryUserById(req.user._id);
    let user = await docClient.get({
      TableName: userTable,
      Key: {
        userId: req.user.userId
      },
      ReturnConsumedCapacity: 'TOTAL'
    }).promise();

    for (let x = 0; x < user.Item.clients.length; x++) {
      if (user.Item.clients[x].id === req.user.clientId) user.Item.clients[x].refreshToken = req.token.refreshToken;
    }
    console.log(user.Item.clients)
    // let result = await database.updateUserById(req.user._id, { clients: user.clients });
    let result = await docClient.update({
      TableName: userTable,
      Key: {
        userId: req.user.userId
      },
      UpdateExpression: 'set #clients = :clients',
      ExpressionAttributeNames: {
        '#clients': 'clients'
      },
      ExpressionAttributeValues: {
        ':clients': user.Item.clients
      },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnValues: 'UPDATED_NEW'
    }).promise();
    console.log("generateRefreshToken", result)
    next();

  } else {
    next();
  }
}

//////////////////////
// server responses //
//////////////////////
const respond = {
  auth: function (req, res) {
    res.status(200).json({
      user: req.user,
      token: req.token
    });
  },
  token: function (req, res) {
    res.status(201).json({
      token: req.token
    });
  },
  reject: function (req, res) {
    res.status(204).end();
  }
};


////////////
// server //
////////////
app.use(logger('dev'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.status(200).json({
    hello: 'world'
  });
});

app.post('/auth', passport.initialize(), passport.authenticate(
  'local', {
    session: false,
    scope: []
  }), serializeUser, serializeClient, generateAccessToken,
  generateRefreshToken, respond.auth);


app.get('/me', authenticate, function (req, res) {
  res.status(200).json(req.user);
});

app.post('/token', validateRefreshToken, generateAccessToken, generateRefreshToken, respond.auth);
app.post('/token/reject', validateRefreshToken, respond.reject);

http.createServer(app).listen(PORT, function () {
  console.log('server listening on port ', PORT);
});

function refreshTokenInDB(clients, token) {
  let found = false;
  for (let x = 0; x < clients.length; x++) {
    if (clients[x].id === token) {
      found = true;
      break;
    }
  }
  if (found === true) return true;
  else return false;
}