const url = '/userService/passwordReset';
const userId = '';
const password = 'test';
const newPassword = 'newPasswordTest';

exports.resetPasswordInit = {
  url,
  headers: {},
  body: {
    email: 'ryqan33@gmail.com'
  }
};

exports.resetPasswordInitBadEmail = {
  url,
  headers: {},
  body: {
    email: 'PEEP'
  }
};

exports.resetPasswordConfirm = {
  url,
  headers: {},
  body: {
    password: 'test',
    passwordResetHash:
      '2ddb8c548672cb8eaa45014c80eb06db477efaa6e4f1c6b17ac1bbd8f913e993'
  },
  oldPassword: 'oldPasswordUnEncrypted',
  salt: '1234567890876543',
  email: 'test@passwordreset.com',
  userId: '3d0b5d8f-85ad-4d03-8229-0976aed17779'
};

exports.resetPasswordNoRequestMode = {
  url,
  headers: {},
  body: {}
};
