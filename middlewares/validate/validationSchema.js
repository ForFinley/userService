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

const signIn = [
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
    param: 'query',
    field: 'emailHash',
    required: true
  }
];

module.exports = {
  registration,
  signIn,
  changePassword,
  signOut,
  verifyEmail
};
