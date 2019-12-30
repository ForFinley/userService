const urlInit = '/identity-service/passwordResetInit';
const urlConfirm = '/identity-service/passwordResetConfirm';
const userId = '9a147e69-9bba-443d-8680-2020cbf52aaa';

exports.resetPasswordInit = {
  url: urlInit,
  headers: {},
  body: {
    email: 'ryqan@gmail.com'
  },
  userId
};

exports.resetPasswordInitBadEmail = {
  url: urlInit,
  headers: {},
  body: {
    email: 'PEEP'
  }
};

exports.resetPasswordInitBadUserEmail = {
  url: urlInit,
  headers: {},
  body: {
    email: 'userNotInDB@gmail.com'
  }
};

exports.resetPasswordConfirm = {
  url: urlConfirm,
  headers: {},
  body: {
    password: 'test',
    passwordResetHash:
      '018ffbceeaee5898a04e3fe2d1c050a1:89c8b35d22b26d451b2cf7bfe2fe960fbf114a5b5ca1'
  },
  oldPassword: 'oldPasswordUnEncrypted',
  email: 'test@passwordreset.com',
  userId: '3d0b5d8f-85ad-4d03-8229-0976aed17779'
};

exports.resetPasswordConfirmInvalidUser = {
  url: urlConfirm,
  headers: {},
  body: {
    password: 'test',
    passwordResetHash:
      'dc0d43a96c87f220ed1e0f08e8ae05f1:a10f1327a0ddfbdca4e35c3a602ba92808d591d03d6ba4a9a170ba9f0a89d28c17'
  },
  oldPassword: 'oldPasswordUnEncrypted',
  email: 'testInvalidUser@passwordreset.com',
  userId: '3d0b5d8f-85ad-4d03-8229-0976aed17779'
};
