const url = '/userService/changeEmail';
const userId = '375d7ab0-8af2-4092-b8d2-4ef0bec0159d';
const authorization =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNzVkN2FiMC04YWYyLTQwOTItYjhkMi00ZWYwYmVjMDE1OWQiLCJlbWFpbCI6Im9nZW1haWxAdGVzdC5jb20iLCJyb2xlIjoiUEVBU0FOVCIsImlhdCI6MTU1MzgxMDQ3MX0.MjgfGPrGQ_iisD3WOiAFwUx4Ndi59T7p2bpMF7_Hoq0';
const email = 'ogemail@test.com';
const newEmail = 'newemail@test.com';
const changeEmailHash =
  '8b61bedbb76d51f49bb1130dd240f5a10345419931e1da499b9f71502c39ac337256c706f8ae7bbca772f1f37cedddfb';
const emailInUseTest = 'emailinuse@test.com';

exports.changeEmailRecord = {
  userId,
  email,
  password: 'asdkfjsiejsdjfs',
  salt: 'asldkjfeoij'
};

exports.changeEmailInUseRecord = {
  userId: 'c05c490c-b77e-42d6-9497-0a0be8bcf2d7',
  email: emailInUseTest
};

exports.changeEmailInit = {
  url,
  headers: { authorization },
  body: {}
};

exports.changeEmailUnauthorized = {
  url,
  headers: { authorization: 'BAD_AUTH_TOKEN' },
  body: {}
};

exports.changeEmailInvalidParams = {
  url,
  headers: {},
  body: { email }
};

exports.changeEmailConfirm = {
  url,
  headers: {},
  body: { email: newEmail, changeEmailHash },
  userId
};

exports.changeEmailConfirmBadHash = {
  url,
  headers: {},
  body: { email: 'NEW_NEW_NEW_Email@test.com', changeEmailHash: 'BAD_HASH' },
  userId
};

exports.changeEmailInUse = {
  url,
  headers: {},
  body: { email: emailInUseTest, changeEmailHash },
  userId
};
