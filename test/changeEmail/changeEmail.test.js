const { server } = require('../../app.js');
const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const fixtures = require('./fixtures.js');
const { getUser } = require('../dynamodbLocal.js');

chai.use(chaihttp);
const { expect } = chai;

exports.changeEmailTests = () => {
  it('Should init change email', done => {
    const { changeEmailInit } = fixtures;
    chai
      .request(server)
      .post(changeEmailInit.url)
      .set(changeEmailInit.headers)
      .send(changeEmailInit.body)
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        const toBe = 'Change email sent';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should confirm change email', done => {
    const { changeEmailConfirm } = fixtures;
    chai
      .request(server)
      .post(changeEmailConfirm.url)
      .set(changeEmailConfirm.headers)
      .send(changeEmailConfirm.body)
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        const toBe = 'Change email complete';
        expect(res.body.message).to.equal(toBe);
        const user = await getUser(changeEmailConfirm.userId);
        expect(changeEmailConfirm.body.email).to.equal(user.email);
        done();
      });
  });

  it('Should return 401 for unauthorized', done => {
    const { changeEmailUnauthorized } = fixtures;
    chai
      .request(server)
      .post(changeEmailUnauthorized.url)
      .set(changeEmailUnauthorized.headers)
      .send(changeEmailUnauthorized.body)
      .end(async (err, res) => {
        expect(res).to.have.status(401);
        const toBe = 'Unauthorized';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 400 for missing required query string parameters', done => {
    const { changeEmailInvalidParams } = fixtures;
    chai
      .request(server)
      .post(changeEmailInvalidParams.url)
      .set(changeEmailInvalidParams.headers)
      .send(changeEmailInvalidParams.body)
      .end(async (err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'Missing required parameters';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 409 for email already in use', done => {
    const { changeEmailInUse } = fixtures;
    chai
      .request(server)
      .post(changeEmailInUse.url)
      .set(changeEmailInUse.headers)
      .send(changeEmailInUse.body)
      .end(async (err, res) => {
        expect(res).to.have.status(409);
        const toBe = 'Email already in use';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });
};
