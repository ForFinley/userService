const url = '/identity-service/registration';
const email = 'registerTest@test.com';
const password = 'test11';

exports.registerNewUser = {
  url,
  headers: {},
  body: {
    email,
    password,
  },
};

exports.registerNewUserExistingEmail = {
  url,
  headers: {},
  body: {
    email: 'existingemail@test.com',
    password,
  },
  userId: '133aa554-7b51-44f9-854d-2ecdc34bba6a',
};

exports.registerNewUserNoEmail = {
  url,
  headers: {},
  body: {
    password,
  },
};

exports.registerNewUserNoPassword = {
  url,
  headers: {},
  body: {
    email,
  },
};
