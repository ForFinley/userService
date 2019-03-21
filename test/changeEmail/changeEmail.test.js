const { server } = require('../../app.js');
const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const fixtures = require('./fixtures.js');
const { getUser } = require('../helpers.js');

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
};
