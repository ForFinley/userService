const url = '/userService/changeEmail';
const userId = '375d7ab0-8af2-4092-b8d2-4ef0bec0159d';
const authorization =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNzVkN2FiMC04YWYyLTQwOTItYjhkMi00ZWYwYmVjMDE1OWQiLCJlbWFpbCI6Ik9HRW1haWxAdGVzdC5jb20iLCJyb2xlIjoiUEVBU0FOVCIsImlhdCI6MTU1MzEzODA2OH0.hixhKZmCsBj5CejaZU7tYKg4oeycb6EIbzYZUHww5xw';
const email = 'OGEmail@test.com';

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
