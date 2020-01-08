/* eslint-disable operator-linebreak */
const url = '/identity-service/refresh';
const userId = '1370a6e1-1311-4af6-9eb8-6ede26d7be49';
const email = 'refreshuser@test.com';
const role = 'PEASANT';
const refreshToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMzcwYTZlMS0xMzExLTRhZjYtOWViOC02ZWRlMjZkN2JlNDkiLCJpYXQiOjE1NzY4Nzg1Mjd9.ab15RvCFD9-EilPAz8n4XRAhsjdcFt1E2P01_KG7iek';
const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36';

exports.refreshRecord = {
  userId,
  refreshToken,
  userAgent,
  email,
  role,
};

exports.refreshFixture = {
  url,
  headers: { Authorization: refreshToken },
  body: {},
  userId,
  email,
  role,
};

exports.refreshFixtureUnauthorized = {
  url,
  headers: { Authorization: 'BAD REFRESH TOKEN' },
  body: {},
};

exports.refreshFixture409 = {
  url,
  headers: {
    Authorization:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0OGJiNDhhOS0yYjg5LTQ2ODktYTM3OC1lNTNlZTdiNWIzZTAiLCJpYXQiOjE1NzY4NzkyMjl9.yRmx7Y4imgG0tMqA6oZXH2RvVuY8NYayqbWvtETD5iw',
  },
  body: {},
};
