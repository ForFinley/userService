const { server } = require('../../app.js');
const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const fixtures = require('./fixtures.js');
const { getUser } = require('../dynamodbLocal.js');

chai.use(chaihttp);
const { expect } = chai;

exports.verifyEmailTests = () => {
  it('Should verify email and update user record', done => {
    const { verifyEmail } = fixtures;
    chai
      .request(server)
      .get(`${verifyEmail.url}/${verifyEmail.emailHash}`)
      .set(verifyEmail.headers)
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        const toBe = 'email verified';
        expect(res.body.message).to.equal(toBe);
        const user = await getUser(verifyEmail.userId);
        expect(user.emailVerified).to.equal(true);
        done();
      });
  });

  it('Should return 400 for no email hash in path', done => {
    const { verifyEmailNoHash } = fixtures;
    chai
      .request(server)
      .get(`${verifyEmailNoHash.url}/${verifyEmailNoHash.emailHash}`)
      .set(verifyEmailNoHash.headers)
      .end((err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'Missing required parameter: email';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 400 for bad email hash', done => {
    const { verifyEmailBadHash } = fixtures;
    chai
      .request(server)
      .get(`${verifyEmailBadHash.url}/${verifyEmailBadHash.emailHash}`)
      .set(verifyEmailBadHash.headers)
      .end((err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'hash invalid';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 400 for email not in system', done => {
    const { verifyEmailcorrectHashBadEmail } = fixtures;
    chai
      .request(server)
      .get(
        `${verifyEmailcorrectHashBadEmail.url}/${
          verifyEmailcorrectHashBadEmail.emailHash
        }`
      )
      .set(verifyEmailcorrectHashBadEmail.headers)
      .end((err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'email hash invalid';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });
};
