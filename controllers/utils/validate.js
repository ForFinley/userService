exports.validate = model => {
  return function(req, res, next) {
    for (let x = 0; x < model.length; x++) {
      if (
        model[x].required === true &&
        !requiredFields(model[x], req[model[x].param][model[x].field], res)
      )
        return false;

      if (
        model[x].field === 'email' &&
        !checkEmail(req[model[x].param][model[x].field], res)
      )
        return false;
    }
    next();
  };
};

const requiredFields = (model, value, res) => {
  if (!value || value < 1 || value === 'undefined') {
    res.status(400).send({ message: `MISSING_${model.field.toUpperCase()}` });
    return false;
  }
  return true;
};

const checkEmail = (value, res) => {
  const regex = /\S+@\S+/; //Just checks for @
  if (!regex.test(value)) {
    res.status(400).send({ message: 'INVALID_EMAIL' });
    return false;
  }
  return true;
};
