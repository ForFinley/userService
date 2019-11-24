const validationSchema = require('./validationSchema');

exports.validate = (req, res, next) => {
  const path = req.path.split('/')[2];
  if (!validationSchema[path]) return next();

  const schema = validationSchema[path];

  for (let x = 0; x < schema.length; x++) {
    let param = req[schema[x].param][schema[x].field];

    // Makes sure required fields are present and valid
    if (schema[x].required === true && !requiredFields(schema[x], param, res))
      return;

    // Makes sure email is valid format
    if (schema[x].field === 'email') param = param.trim().toLowerCase();
    if (schema[x].field === 'email' && !checkEmail(param, res)) return;

    //  Makes sure password is valid format
    if (
      (schema[x].field === 'password' || schema[x].field === 'newPassword') &&
      !checkPassword(param, res)
    )
      return;
  }
  return next();
};

const requiredFields = (schema, param, res) => {
  if (!param || param < 1 || param === 'undefined') {
    res.status(400).send({ message: `MISSING_${schema.field.toUpperCase()}` });
    return false;
  }
  return true;
};

const checkEmail = (param, res) => {
  const regex = /\S+@\S+/; //Just checks for @
  if (!regex.test(param)) {
    res.status(400).send({ message: 'INVALID_EMAIL' });
    return false;
  }
  return true;
};

const checkPassword = (param, res) => {
  if (param.length < 5) {
    res.status(400).send({ message: 'INVALID_PASSWORD' });
    return false;
  }
  return true;
};
