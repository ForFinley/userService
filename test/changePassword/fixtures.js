const url = '/identity-service/changePassword';
const userId = 'f759aa6e-3dec-4d94-bc4c-a380014f7515';
const password = 'test11';
const newPassword = 'newPasswordTest';
const jwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNzU5YWE2ZS0zZGVjLTRkOTQtYmM0Yy1hMzgwMDE0Zjc1MTUiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJyb2xlIjoiUEVBU0FOVCIsImlhdCI6MTU1MzgxMDM0N30.iC5Tl3Uh2zsMAGFQJfXsiSK-w8yKkaoC3_CVX0lyS1g';

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
  encryptPass: '5e2711278089c15b3e243e557e019b5c', //for password 'test11'
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
