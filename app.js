require('dotenv').config();
console.log(`---- Starting NODE_ENV=${process.env.NODE_ENV} ----`);

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { validate } = require('./middlewares/validate');
const rateLimit = require('express-rate-limit');

const app = express();

const identityService = require('./routes');

app.use(morgan('tiny'));
app.use(express.json({ type: '*/*' }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(validate);

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter); //  apply to all requests

app.use('/identity-service', identityService);

exports.server = app.listen(3000, () => {
  console.log(`
'####'########:'########'##::: ##'########'####'########'##:::'##:
. ##::##.... ##:##.....::###:: ##... ##..:. ##:... ##..:. ##:'##::
: ##::##:::: ##:##:::::::####: ##::: ##:::: ##:::: ##::::. ####:::
: ##::##:::: ##:######:::## ## ##::: ##:::: ##:::: ##:::::. ##::::
: ##::##:::: ##:##...::::##. ####::: ##:::: ##:::: ##:::::: ##::::
: ##::##:::: ##:##:::::::##:. ###::: ##:::: ##:::: ##:::::: ##::::
'####:########::########:##::. ##::: ##:::'####::: ##:::::: ##::::
....:........::........:..::::..::::..::::....::::..:::::::..:::::
`);
  console.log(`---- Server running at localhost:${process.env.PORT} ----`);
});
