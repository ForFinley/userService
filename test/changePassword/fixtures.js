/* eslint-disable operator-linebreak */
const url = '/identity-service/changePassword';
const userId = '25ab62fb-e20f-4ceb-95e5-2c59167b71e0';
const password = 'test1';
const newPassword = 'newPasswordTest';
const jwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNWFiNjJmYi1lMjBmLTRjZWItOTVlNS0yYzU5MTY3YjcxZTAiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwicm9sZSI6IlBFQVNBTlQiLCJpYXQiOjE1NzY4Nzc4NDR9.ZI7Nqt9azxfbZ1vzrSX67lGoJ-C-hwE93UFM6YVjMnE';

exports.changePassword = {
  url,
  headers: { Authorization: jwt },
  body: {
    newPassword,
    password,
  },
  user: {
    userId,
  },
  encryptPass: '4dbe02f358c38eab183e49a9b9db0787:7b1d44798c', // for password 'test1'
  salt: 'e90f20',
};

exports.changePasswordNoPassword = {
  url,
  headers: { Authorization: jwt },
  body: {
    newPassword,
  },
  user: {
    userId,
  },
};

exports.changePasswordNoNewPassword = {
  url,
  headers: { Authorization: jwt },
  body: {
    password,
  },
  user: {
    userId,
  },
};
exports.changePasswordWrongPassword = {
  url,
  headers: { Authorization: jwt },
  body: {
    newPassword,
    password: 'WrongPassword',
  },
  user: {
    userId,
  },
};
