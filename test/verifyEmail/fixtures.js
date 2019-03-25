const url = '/userService/verifyEmail';
const userId = 'd39254ff-30a2-4b97-980e-c19fa75231e1';
const email = 'verifyEmailTest@test.com';
const emailHash =
  'efc97663e61d78130eacf24ce75caa4a44b6cc3baccbc98506b7c38690906947';
const headers = {};

exports.verifyEmail = {
  url,
  headers,
  emailHash,
  userId,
  email
};

exports.verifyEmailNoHash = {
  url,
  headers,
  userId,
  email
};

exports.verifyEmailBadHash = {
  url,
  headers,
  emailHash: 'GARBAGE HASH BB',
  userId,
  email
};

//This is probably never going to happen, this is when there is a good emailHash with a email not in our system
exports.verifyEmailcorrectHashBadEmail = {
  url,
  headers,
  emailHash: '782f267054bd09756911c1b61d0ab0b18b1ba0c8a09886a0e36d0d65d87f3422',
  userId,
  email
};
