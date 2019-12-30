const { server } = require('../../app');
const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const nock = require('nock');
const fixtures = require('./fixtures');
const { SG_URL } = process.env;

chai.use(chaihttp);
const { expect } = chai;

exports.passwordResetInitTests = () => {
  it('Should init reset password', done => {
    const { resetPasswordInit } = fixtures;

    nock(SG_URL)
      .post('/v3/mail/send')
      .reply(200, undefined);

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

  it('Should return 400 for invalid email', done => {
    const { resetPasswordInitBadEmail } = fixtures;
    chai
      .request(server)
      .post(resetPasswordInitBadEmail.url)
      .set(resetPasswordInitBadEmail.headers)
      .send(resetPasswordInitBadEmail.body)
      .end(async (err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'INVALID_EMAIL';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 400 for email not in system', done => {
    const { resetPasswordInitBadUserEmail } = fixtures;
    chai
      .request(server)
      .post(resetPasswordInitBadUserEmail.url)
      .set(resetPasswordInitBadUserEmail.headers)
      .send(resetPasswordInitBadUserEmail.body)
      .end(async (err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'invalid user email';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  //This causes an ugly console
  // it('Should return 400 for email not being sent', done => {
  //   const { resetPasswordInit } = fixtures;

  //   nock(SG_URL)
  //     .post('/v3/mail/send')
  //     .reply(400, 'ERROR');

  //   chai
  //     .request(server)
  //     .post(resetPasswordInit.url)
  //     .set(resetPasswordInit.headers)
  //     .send(resetPasswordInit.body)
  //     .end(async (err, res) => {
  //       expect(res).to.have.status(400);
  //       const toBe = 'email not sent';
  //       expect(res.body.message).to.equal(toBe);
  //       done();
  //     });
  // });
};
