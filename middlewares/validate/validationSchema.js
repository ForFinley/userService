const registration = [
  {
    param: 'body',
    field: 'email',
    required: true
  },
  {
    param: 'body',
    field: 'password',
    required: true
  }
];

const changePassword = [
  {
    param: 'body',
    field: 'password',
    required: true
  },
  {
    param: 'body',
    field: 'newPassword',
    required: true
  }
];

const signOut = [
  {
    param: 'headers',
    field: 'authorization',
    required: true
  }
];

const verifyEmail = [
  {
    param: 'params',
    field: 'emailHash',
    required: true
  }
];

module.exports = {
  registration,
  changePassword,
  signOut,
  verifyEmail
};