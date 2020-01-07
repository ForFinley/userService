/* eslint-disable operator-linebreak */
const url = '/identity-service/verifyEmail';
const userId = 'd39254ff-30a2-4b97-980e-c19fa75231e1';
const email = 'test1@gmail.com';
const emailHash =
  '0eabf36e530404c9e915a970df2869cc:9a6324b8bfb18b12e5a00049937f54';
const headers = {};

exports.verifyEmail = {
  url,
  headers,
  emailHash,
  userId,
  email,
};

exports.verifyEmailNoHash = {
  url,
  headers,
  userId,
  email,
};

exports.verifyEmailBadHash = {
  url,
  headers,
  emailHash: 'GARBAGE HASH BB',
  userId,
  email,
};

// This is probably never going to happen,
// this is when there is a good emailHash with a email not in our system
exports.verifyEmailcorrectHashBadEmail = {
  url,
  headers,
  emailHash:
    '7d8e1a2a1f907456cadd62d313971151:a2c4ea02e9ff7176e7a4b929dee73c682a309a910249fba92d6c',
  userId,
  email,
};
