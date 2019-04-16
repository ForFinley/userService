const { server } = require('../../app.js');
const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const fixtures = require('./fixtures.js');
const { getUser } = require('../dynamodbLocal.js');

chai.use(chaihttp);
const { expect } = chai;

exports.passwordResetTests = (sandbox, nodemailer) => {
  it('Should init reset password', done => {
    const { resetPasswordInit } = fixtures;
    chai
      .request(server)
      .post(resetPasswordInit.url)
      .set(resetPasswordInit.headers)
      .send(resetPasswordInit.body)
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        const toBe = 'Password reset email sent!';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 400 for email not in system', done => {
    sandbox.restore();
    sandbox.stub(nodemailer.prototype, 'sendMail').returns(false);
    const { resetPasswordInitBadEmail } = fixtures;
    chai
      .request(server)
      .post(resetPasswordInitBadEmail.url)
      .set(resetPasswordInitBadEmail.headers)
      .send(resetPasswordInitBadEmail.body)
      .end(async (err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'email is not in our system';
        expect(res.body.message).to.equal(toBe);
        //Restores nodemailer to return true
        sandbox.restore();
        sandbox.stub(nodemailer.prototype, 'sendMail').returns(true);
        done();
      });
  });

  it('Should confirm reset password', done => {
    const { resetPasswordConfirm } = fixtures;
    chai
      .request(server)
      .post(resetPasswordConfirm.url)
      .set(resetPasswordConfirm.headers)
      .send(resetPasswordConfirm.body)
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        const toBe = 'Password update success!';
        expect(res.body.message).to.equal(toBe);
        const userAfter = await getUser(resetPasswordConfirm.userId);
        expect(resetPasswordConfirm.password).to.not.equal(userAfter.password);
        expect(resetPasswordConfirm.salt).to.not.equal(userAfter.salt);
        done();
      });
  });

  it('Should return 400 for no request mode, invalid body', done => {
    const { resetPasswordNoRequestMode } = fixtures;
    chai
      .request(server)
      .post(resetPasswordNoRequestMode.url)
      .set(resetPasswordNoRequestMode.headers)
      .send(resetPasswordNoRequestMode.body)
      .end(async (err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'MISSING_REQUIRED_PARAMETERS';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });
};
