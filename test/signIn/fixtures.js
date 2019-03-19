const url = '/userService/signIn';
const email = 'signin@test.com';
const password = 'test';
const encrytPassword = '9d044b1d681b667fe0e934b09c1eb1d0';
const salt = 'b23b46';
const userId = 'e0409f76-4471-11e9-b210-d663bd873d93';

exports.signInUser = {
  url,
  userId,
  encrytPassword,
  salt,
  headers: {},
  body: {
    email,
    password
  }
};

exports.signInUserNoEmail = {
  url,
  userId,
  encrytPassword,
  salt,
  headers: {},
  body: {
    password
  }
};

exports.signInUserNoPassword = {
  url,
  userId,
  encrytPassword,
  salt,
  headers: {},
  body: {
    email
  }
};

exports.signInUserInvalidCreds = {
  url,
  userId,
  encrytPassword,
  salt,
  headers: {},
  body: {
    email: 'wrongEmail',
    password: 'wrongPassword'
  }
};
