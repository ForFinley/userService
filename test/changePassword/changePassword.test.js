const { server } = require('../../app.js');
const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const fixtures = require('./fixtures.js');
const { getUser } = require('../helpers.js');

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
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        const user = await getUser(changePassword.user.userId);
        expect(user.password).to.not.equal(changePassword.encryptPass);
        expect(user.salt).to.not.equal(changePassword.salt);
        done();
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
        const toBe = 'Missing required parameter: password';
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
        const toBe = 'Missing required parameter: newPassword';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 400 for wrong password in request', done => {
    const { changePasswordWrongPassword } = fixtures;
    chai
      .request(server)
      .post(changePasswordWrongPassword.url)
      .set(changePasswordWrongPassword.headers)
      .send(changePasswordWrongPassword.body)
      .end((err, res) => {
        expect(res).to.have.status(401);
        const toBe = 'Password incorrect';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });
};
