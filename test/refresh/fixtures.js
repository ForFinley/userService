const url = '/userService/refresh';
const userId = '35eace1e-d5ad-4096-b02e-0090fbf5f21a';
const refreshToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNWVhY2UxZS1kNWFkLTQwOTYtYjAyZS0wMDkwZmJmNWYyMWEiLCJpYXQiOjE1NTM2MzI3NTd9.LBHULWYXussvIuaWSMKL1nvTj8vfxDKA7rTpUsVfys4';
const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36';

exports.refreshRecord = {
  userId,
  refreshToken,
  userAgent,
  email: 'refreshuser@test.com',
  role: 'PEASANT'
};

exports.refreshFixture = {
  url,
  headers: { authorization: refreshToken },
  body: {}
};
