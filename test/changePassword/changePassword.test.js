const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const { server } = require('../../app');
const fixtures = require('./fixtures');
const { getUser } = require('../dynamodbLocal');

chai.use(chaihttp);
const { expect } = chai;

exports.changePasswordTests = () => {
  it('Should change password', done => {
    const { changePassword } = fixtures;
    chai
      .request(server)
      .post(changePassword.url)
      .set(changePassword.headers)
      .send(changePassword.body)
      .end((err, res) => {
        expect(res).to.have.status(200);
        getUser(changePassword.user.userId).then(user => {
          expect(user.password).to.not.equal(changePassword.encryptPass);
          done();
        });
      });
  });

  it('Should return 400 for no password in request', done => {
    const { changePasswordNoPassword } = fixtures;
    chai
      .request(server)
      .post(changePasswordNoPassword.url)
      .set(changePasswordNoPassword.headers)
      .send(changePasswordNoPassword.body)
      .end((err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'MISSING_PASSWORD';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 400 for no newPassword in request', done => {
    const { changePasswordNoNewPassword } = fixtures;
    chai
      .request(server)
      .post(changePasswordNoNewPassword.url)
      .set(changePasswordNoNewPassword.headers)
      .send(changePasswordNoNewPassword.body)
      .end((err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'MISSING_NEWPASSWORD';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 401 for wrong password in request', done => {
    const { changePasswordWrongPassword } = fixtures;
    chai
      .request(server)
      .post(changePasswordWrongPassword.url)
      .set(changePasswordWrongPassword.headers)
      .send(changePasswordWrongPassword.body)
      .end((err, res) => {
        expect(res).to.have.status(401);
        const toBe = 'password incorrect';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });
};
