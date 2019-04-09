const { server } = require('../../app.js');
const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const fixtures = require('./fixtures.js');
const { userInDynamo } = require('../dynamodbLocal.js');

chai.use(chaihttp);
const { expect } = chai;

exports.registrationTests = () => {
  it('Should register a new user', done => {
    const { registerNewUser } = fixtures;
    chai
      .request(server)
      .post(registerNewUser.url)
      .set(registerNewUser.headers)
      .send(registerNewUser.body)
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        const userBool = await userInDynamo(res.body.userId);
        expect(userBool).to.equal(true);
        done();
      });
  });

  it('Should return 409 for email already exists', done => {
    const { registerNewUserExistingEmail } = fixtures;

    chai
      .request(server)
      .post(registerNewUserExistingEmail.url)
      .set(registerNewUserExistingEmail.headers)
      .send(registerNewUserExistingEmail.body)
      .end((err, res) => {
        expect(res).to.have.status(409);
        const toBe = 'Email already in use';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 400 for no email in request', done => {
    const { registerNewUserNoEmail } = fixtures;
    chai
      .request(server)
      .post(registerNewUserNoEmail.url)
      .set(registerNewUserNoEmail.headers)
      .send(registerNewUserNoEmail.body)
      .end((err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'MISSING_EMAIL';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 400 for no password in request', done => {
    const { registerNewUserNoPassword } = fixtures;
    chai
      .request(server)
      .post(registerNewUserNoPassword.url)
      .set(registerNewUserNoPassword.headers)
      .send(registerNewUserNoPassword.body)
      .end((err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'MISSING_PASSWORD';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });
};
