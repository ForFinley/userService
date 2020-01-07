/* eslint-disable operator-linebreak */
const url = '/identity-service/signOut';
const userId = 'c875e2b9-d552-45b8-889d-8e58412349eb';
const refreshToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjODc1ZTJiOS1kNTUyLTQ1YjgtODg5ZC04ZTU4NDEyMzQ5ZWIiLCJpYXQiOjE1NTUwODE4NzJ9.XIV05vSpOr71cAI45mRbnAi_38Tum2K-MwhwqX24-Po';

exports.signOutFixture = {
  url,
  headers: { authorization: refreshToken },
  userId,
};
