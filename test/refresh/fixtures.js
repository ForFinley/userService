const url = '/identity-service/refresh';
const userId = '35eace1e-d5ad-4096-b02e-0090fbf5f21a';
const email = 'refreshuser@test.com';
const role = 'PEASANT';
const refreshToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNWVhY2UxZS1kNWFkLTQwOTYtYjAyZS0wMDkwZmJmNWYyMWEiLCJpYXQiOjE1NTM2MzI3NTd9.LBHULWYXussvIuaWSMKL1nvTj8vfxDKA7rTpUsVfys4';
const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36';

exports.refreshRecord = {
  userId,
  refreshToken,
  userAgent,
  email,
  role
};

exports.refreshFixture = {
  url,
  headers: { authorization: refreshToken },
  body: {},
  userId,
  email,
  role
};

exports.refreshFixtureUnauthorized = {
  url,
  headers: { authorization: 'BAD REFRESH TOKEN' },
  body: {}
};

exports.refreshFixture409 = {
  url,
  headers: {
    authorization:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkiLCJpYXQiOjE1NTUwMTY5MDN9.sn896WZQCqktv5k1thu_6Eqxav8PyV5gjkU37ECt17Y'
  },
  body: {}
};
