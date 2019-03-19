const url = '/userService/changePassword';
const userId = 'f759aa6e-3dec-4d94-bc4c-a380014f7515';
const password = 'test';
const newPassword = 'newPasswordTest';
//jwt just has userId
const jwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNzU5YWE2ZS0zZGVjLTRkOTQtYmM0Yy1hMzgwMDE0Zjc1MTUiLCJpYXQiOjE1NTI3MTI0Nzd9.wgIsEwTVT-_lxcool6itJg16jaOiEPFbhkwgRjvhYck';

exports.changePassword = {
  url,
  headers: { authorization: jwt },
  body: {
    newPassword,
    password
  },
  user: {
    userId
  },
  encryptPass: '5bd1e6036c14bd42fe57e32d51e8d1b9', //for password 'test'
  salt: 'e90f20'
};

exports.changePasswordNoPassword = {
  url,
  headers: { authorization: jwt },
  body: {
    newPassword
  },
  user: {
    userId
  }
};

exports.changePasswordNoNewPassword = {
  url,
  headers: { authorization: jwt },
  body: {
    password
  },
  user: {
    userId
  }
};
exports.changePasswordWrongPassword = {
  url,
  headers: { authorization: jwt },
  body: {
    newPassword,
    password: 'WrongPassword'
  },
  user: {
    userId
  }
};
