const { server } = require('../../app');
const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const nock = require('nock');
const fixtures = require('./fixtures');
const { getUser } = require('../dynamodbLocal');
const { SG_URL } = process.env;

chai.use(chaihttp);
const { expect } = chai;

exports.changeEmailConfirmTests = () => {
  it('Should confirm change email', done => {
    const { changeEmailConfirm } = fixtures;

    nock(SG_URL)
      .post('/v3/mail/send')
      .reply(200, undefined);

    chai
      .request(server)
      .post(changeEmailConfirm.url)
      .set(changeEmailConfirm.headers)
      .send(changeEmailConfirm.body)
      .end((err, res) => {
        expect(res).to.have.status(200);
        const toBe = 'Change email complete!';
        expect(res.body.message).to.equal(toBe);
        getUser(changeEmailConfirm.userId).then(user => {
          expect(changeEmailConfirm.body.email).to.equal(user.email);
          done();
        });
      });
  });

  it('Should return 409 for email already in use', done => {
    const { changeEmailInUse } = fixtures;
    chai
      .request(server)
      .post(changeEmailInUse.url)
      .set(changeEmailInUse.headers)
      .send(changeEmailInUse.body)
      .end((err, res) => {
        expect(res).to.have.status(409);
        const toBe = 'email already in use';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 400 for invalid emailHash', done => {
    const { changeEmailConfirmBadHash } = fixtures;
    chai
      .request(server)
      .post(changeEmailConfirmBadHash.url)
      .set(changeEmailConfirmBadHash.headers)
      .send(changeEmailConfirmBadHash.body)
      .end((err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'invalid email hash';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  //   it('Should 400 for email not sent', done => {
  //     const { changeEmailConfirm } = fixtures;

  //     nock(SG_URL)
  //       .post('/v3/mail/send')
  //       .reply(200, 'error');

  //     chai
  //       .request(server)
  //       .post(changeEmailConfirm.url)
  //       .set(changeEmailConfirm.headers)
  //       .send(changeEmailConfirm.body)
  //       .end((err, res) => {
  //         expect(res).to.have.status(400);
  //         const toBe = 'email not sent';
  //         expect(res.body.message).to.equal(toBe);
  //         done();
  //       });
  //   });
};
