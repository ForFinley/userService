const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { validate } = require('./controllers/utils/validate');

// const rateLimit = require('express-rate-limit');

const app = express();

const userService = require('./routes/userService');

app.use(express.json({ type: '*/*' }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(validate);

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter); //  apply to all requests

app.use('/userService', userService);

// exports.server = app;
exports.server = app.listen(3000, () => {
  console.log('server running at ' + 3000);
});
