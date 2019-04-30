exports.validate = model => {
  return (req, res, next) => {
    let returnedParams = {};
    for (let x = 0; x < model.length; x++) {
      let param = req[model[x].param][model[x].field];

      // Makes sure required fields are present and valid
      if (model[x].required === true && !requiredFields(model[x], param, res))
        return false;

      // Makes sure email is valid format
      if (model[x].field === 'email') param = param.trim().toLowerCase();
      if (model[x].field === 'email' && !checkEmail(param, res)) return false;

      //  Makes sure password is valid format
      if (
        (model[x].field === 'password' || model[x].field === 'newPassword') &&
        !checkPassword(param, res)
      )
        return false;

      returnedParams[model[x].field] = param;
    }
    req.validated = returnedParams;
    next();
  };
};

const requiredFields = (model, param, res) => {
  if (!param || param < 1 || param === 'undefined') {
    res.status(400).send({ message: `MISSING_${model.field.toUpperCase()}` });
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
