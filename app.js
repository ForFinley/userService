const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const Strategy = require('passport-local');
const userServiceController = require('./controllers/userService');

const app = express();
const PORT = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
passport.use(new Strategy(userServiceController.passportStrategy));

const index = require('./routes/index');
app.use('/', index);

const userService = require('./routes/userService');
app.use('/userService', userService);


app.listen(PORT, () => {
  console.log('server running at ' + PORT);
});

