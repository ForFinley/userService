const urlInit = '/identity-service/changeEmailInit';
const urlConfirm = '/identity-service/changeEmailConfirm';
const userId = '375d7ab0-8af2-4092-b8d2-4ef0bec0159d';
const authorization =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4NDU4MWFmMC05MzE2LTQ4YmYtOGFiMi1hM2IwM2ZkMWRlNTIiLCJlbWFpbCI6Im9nZW1haWxAdGVzdC5jb20iLCJyb2xlIjoiUEVBU0FOVCIsImlhdCI6MTU3ODEwMTAyMH0.rFqoRbG4SMMx-VfI3zmkc7SlE2-xpr_9SpCZLI2yih4';
const email = 'ogemail@test.com';
const newEmail = 'newemail@test.com';
const changeEmailHash =
  '34f41ab220f423774138dffdcfbf5c6d:1fb7d817af7b0961fc7407240833fa2feff463fe674bdd33b96ec76dbbf6f2ff54862f8e';
const changeEmailHashEmailInUse =
  '2efb6963dd9489c0afa0b35416f863de:ac4ce9cd719155c3d85e0aad6e704ba0e60170fed5d7aea6e498d602de96064980fe86cd';
const emailInUseTest = 'emailinuse@test.com';

exports.changeEmailRecord = {
  userId,
  email,
  password: 'asdkfjsiejsdjfs'
};

exports.changeEmailInUseRecord = {
  userId: 'c05c490c-b77e-42d6-9497-0a0be8bcf2d7',
  email: emailInUseTest
};

exports.changeEmailInit = {
  url: urlInit,
  headers: { authorization },
  body: {}
};

exports.changeEmailUnauthorized = {
  url: urlInit,
  headers: { authorization: 'BAD_AUTH_TOKEN' },
  body: {}
};

exports.changeEmailInvalidParams = {
  url: urlInit,
  headers: {},
  body: { email }
};

exports.changeEmailConfirm = {
  url: urlConfirm,
  headers: {},
  body: { email: newEmail, changeEmailHash },
  userId
};

exports.changeEmailInUse = {
  url: urlConfirm,
  headers: {},
  body: { email: emailInUseTest, changeEmailHash: changeEmailHashEmailInUse },
  userId
};

exports.changeEmailConfirmBadHash = {
  url: urlConfirm,
  headers: {},
  body: { email: 'NEW_NEW_NEW_Email@test.com', changeEmailHash: 'BAD_HASH' },
  userId
};
