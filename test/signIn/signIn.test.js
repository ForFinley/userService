const { server } = require('../../app.js');
const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const fixtures = require('./fixtures.js');
const jwt = require('jsonwebtoken');
const { key } = require('../../controllers/utils/keys/privateKey');

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
        expect(res.body).to.have.all.keys('user', 'token');
        const decodedToken = jwt.verify(res.body.token, key);
        expect(signInUser.userId).to.equal(decodedToken.userId);
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
        const toBe = 'Missing required parameter: email';
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
        const toBe = 'Missing required parameter: password';
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
};
