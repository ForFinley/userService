const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const nock = require('nock');
const { server } = require('../../app');
const fixtures = require('./fixtures');

const { SG_URL } = process.env;

chai.use(chaihttp);
const { expect } = chai;

exports.changeEmailInitTests = () => {
  it('Should init change email', done => {
    const { changeEmailInit } = fixtures;

    nock(SG_URL)
      .post('/v3/mail/send')
      .reply(200, undefined);

    chai
      .request(server)
      .get(changeEmailInit.url)
      .set(changeEmailInit.headers)
      .end((err, res) => {
        expect(res).to.have.status(200);
        const toBe = 'Change email sent!';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 401 for unauthorized', done => {
    const { changeEmailUnauthorized } = fixtures;
    chai
      .request(server)
      .get(changeEmailUnauthorized.url)
      .set(changeEmailUnauthorized.headers)
      .end((err, res) => {
        expect(res).to.have.status(401);
        const toBe = 'Unauthorized';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should 400 for email not sent', done => {
    const { changeEmailInit } = fixtures;

    nock(SG_URL)
      .post('/v3/mail/send')
      .reply(200, 'error');

    chai
      .request(server)
      .get(changeEmailInit.url)
      .set(changeEmailInit.headers)
      .end((err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'email not sent';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });
};
