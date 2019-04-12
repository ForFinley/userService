const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
// const rateLimit = require('express-rate-limit');

const app = express();

const userService = require('./routes/userService.js');

app.use(express.json({ type: '*/*' }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(helmet());
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter); //  apply to all requests

app.use('/userService', userService);

exports.server = app;
// exports.server = app.listen(PORT, () => {
//   console.log('server running at ' + 3000);
// });
