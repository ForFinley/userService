const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const Strategy = require('passport-local');
const passportFunctions = require('./controllers/userService/passport.js');

const app = express();
const PORT = 4000;

const index = require('./routes/index');
const userService = require('./routes/userService');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
passport.use(new Strategy(passportFunctions.passportStrategy));

app.use('/', index);
app.use('/userService', userService);

app.listen(PORT, () => {
  console.log('server running at ' + PORT);
});

