const { server } = require('../../app.js');
const chai = require('chai');
const chaihttp = require('chai-http');
const nock = require('nock');
const { it } = require('mocha');
const fixtures = require('./fixtures.js');
const jwt = require('jsonwebtoken');
const { accessKey } = require('../../controllers/utils/keys/privateKeys.js');

const { GOOGLE_DECRYPT_API } = require('../../env.js');

chai.use(chaihttp);
const { expect } = chai;

exports.signInTests = () => {
  it('Shoud sign in a user', done => {
    const { signInUser } = fixtures;
    chai
      .request(server)
      .post(signInUser.url)
      .set(signInUser.headers)
      .send(signInUser.body)
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys(
          'user',
          'authorizationToken',
          'refreshToken'
        );
        const decodedToken = jwt.verify(res.body.authorizationToken, accessKey);
        expect(signInUser.userId).to.equal(decodedToken.userId);
        expect(res.body.user.userId).to.equal(decodedToken.userId);
        expect(signInUser.body.email).to.equal(decodedToken.email);
        done();
      });
  });

  it('Should return 400 for no email in request', done => {
    const { signInUserNoEmail } = fixtures;
    chai
      .request(server)
      .post(signInUserNoEmail.url)
      .set(signInUserNoEmail.headers)
      .send(signInUserNoEmail.body)
      .end((err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'MISSING_REQUIRED_PARAMS';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 400 for no password in request', done => {
    const { signInUserNoPassword } = fixtures;
    chai
      .request(server)
      .post(signInUserNoPassword.url)
      .set(signInUserNoPassword.headers)
      .send(signInUserNoPassword.body)
      .end((err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'MISSING_REQUIRED_PARAMS';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 401 for no invalid credentials', done => {
    const { signInUserInvalidCreds } = fixtures;
    chai
      .request(server)
      .post(signInUserInvalidCreds.url)
      .set(signInUserInvalidCreds.headers)
      .send(signInUserInvalidCreds.body)
      .end((err, res) => {
        expect(res).to.have.status(401);
        const toBe = 'Email or password incorrect';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Shoud sign in a new user with google provider', done => {
    const { signInNewUserGoogle } = fixtures;
    nock(GOOGLE_DECRYPT_API)
      .get(signInNewUserGoogle.mockGoogleUrl)
      .reply(200, signInNewUserGoogle.googleResponseNewUser);
    chai
      .request(server)
      .post(signInNewUserGoogle.url)
      .set(signInNewUserGoogle.headers)
      .send(signInNewUserGoogle.body)
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys(
          'user',
          'authorizationToken',
          'refreshToken'
        );
        const decodedToken = jwt.verify(res.body.authorizationToken, accessKey);
        expect(signInNewUserGoogle.googleResponseNewUser.email).to.equal(
          decodedToken.email
        );
        expect(res.body.user.userId).to.equal(decodedToken.userId);
        done();
      });
  });

  it('Shoud sign in a existing user with google provider', done => {
    const { signInExistingUserGoogle } = fixtures;
    nock(GOOGLE_DECRYPT_API)
      .get(signInExistingUserGoogle.mockGoogleUrl)
      .reply(200, signInExistingUserGoogle.googleResponseExistingUser);
    chai
      .request(server)
      .post(signInExistingUserGoogle.url)
      .set(signInExistingUserGoogle.headers)
      .send(signInExistingUserGoogle.body)
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys(
          'user',
          'authorizationToken',
          'refreshToken'
        );
        const decodedToken = jwt.verify(res.body.authorizationToken, accessKey);
        expect(
          signInExistingUserGoogle.googleResponseExistingUser.email
        ).to.equal(decodedToken.email);
        expect(res.body.user.userId).to.equal(decodedToken.userId);
        done();
      });
  });

  it('Should return 401 existing Facebook user trying to sign in with google account', done => {
    const { signInExistingFBUserWithGoogle } = fixtures;
    nock(GOOGLE_DECRYPT_API)
      .get(signInExistingFBUserWithGoogle.mockGoogleUrl)
      .reply(200, signInExistingFBUserWithGoogle.googleResponseExistingUser);
    chai
      .request(server)
      .post(signInExistingFBUserWithGoogle.url)
      .set(signInExistingFBUserWithGoogle.headers)
      .send(signInExistingFBUserWithGoogle.body)
      .end((err, res) => {
        expect(res).to.have.status(401);
        const toBe = 'Email already in use with facebook';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });
};
