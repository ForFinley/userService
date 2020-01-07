const url = '/identity-service/signIn';
const email = 'signin@test.com';
const password = 'test1';
const encrytPassword = '4dbe02f358c38eab183e49a9b9db0787:7b1d44798c';
const salt = 'b23b46';
const userId = 'e0409f76-4471-11e9-b210-d663bd873d93';

const googleToken = 'eyJhbGciOiJSU_TEST_TOKEN';
const mockGoogleUrl = `/oauth2/v3/tokeninfo?idToken=${googleToken}`;
const googleResponseNewUser = {
  iss: 'accounts.google.com',
  azp:
    '944002775347-indhvt6hb5ol9eov726hbijclsbrvnii.apps.googleusercontent.com',
  aud:
    '944002775347-indhvt6hb5ol9eov726hbijclsbrvnii.apps.googleusercontent.com',
  sub: '107180533427686243831',
  hd: 'test.com',
  email: 'newgooglesigning@test.com',
  email_verified: 'true',
  at_hash: 'OugFr6t12MrPGNAAkcsRbA',
  name: 'Ryan Feltkamp',
  picture:
    'https://lh4.googleusercontent.com/-aD_FLES1Mj0/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reS8NmkzIm0EZyB5XUoJ8xZD-_2Ow/s96-c/photo.jpg',
  given_name: 'Ryan',
  family_name: 'Feltkamp',
  locale: 'en',
  iat: '1553284640',
  exp: '1553288240',
  jti: 'b25cc6ed92d1d55b19ec76bdda5819545fed7b71',
  alg: 'RS256',
  kid: '0905d6f9cd9b0f1f852e8b207e8f673abca4bf75',
  typ: 'JWT',
};
const googleResponseExistingUser = {
  iss: 'accounts.google.com',
  azp:
    '944002775347-indhvt6hb5ol9eov726hbijclsbrvnii.apps.googleusercontent.com',
  aud:
    '944002775347-indhvt6hb5ol9eov726hbijclsbrvnii.apps.googleusercontent.com',
  sub: '107180533427686243831',
  hd: 'test.com',
  email: 'googlesignin@test.com',
  email_verified: 'true',
  at_hash: 'OugFr6t12MrPGNAAkcsRbA',
  name: 'Chango Martinez',
  picture:
    'https://lh4.googleusercontent.com/-aD_FLES1Mj0/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reS8NmkzIm0EZyB5XUoJ8xZD-_2Ow/s96-c/photo.jpg',
  given_name: 'Chango',
  family_name: 'Martinez',
  locale: 'en',
  iat: '1553284640',
  exp: '1553288240',
  jti: 'b25cc6ed92d1d55b19ec76bdda5819545fed7b71',
  alg: 'RS256',
  kid: '0905d6f9cd9b0f1f852e8b207e8f673abca4bf75',
  typ: 'JWT',
};

exports.signInUser = {
  url,
  userId,
  encrytPassword,
  salt,
  headers: {},
  body: {
    email,
    password,
  },
};

exports.signInNewUserGoogle = {
  url,
  mockGoogleUrl,
  googleResponseNewUser,
  headers: { authorization: googleToken },
  body: {
    provider: 'google',
  },
};

exports.signInExistingUserGoogle = {
  url,
  userId: '36c9c405-3c48-4683-b1cd-d5ebabdd5775',
  mockGoogleUrl,
  googleResponseExistingUser,
  headers: { authorization: googleToken },
  body: {
    provider: 'google',
  },
};

exports.signInExistingFBUserWithGoogle = {
  url,
  userId: 's1ef399t-3c48-4683-b1cd-38f38wf9s99',
  mockGoogleUrl,
  googleResponseExistingUser: { email: 'usersignedinwithfacebook@test.com' },
  headers: { authorization: googleToken },
  body: {
    provider: 'google',
  },
};

exports.signInUserNoEmail = {
  url,
  userId,
  encrytPassword,
  salt,
  headers: {},
  body: {
    password,
  },
};

exports.signInUserNoPassword = {
  url,
  userId,
  encrytPassword,
  salt,
  headers: {},
  body: {
    email,
  },
};

exports.signInUserInvalidCreds = {
  url,
  userId,
  encrytPassword,
  salt,
  headers: {},
  body: {
    email: 'wrongEmail@junk.com',
    password: 'wrongPassword',
  },
};
