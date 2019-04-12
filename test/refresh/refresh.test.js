const { server } = require('../../app.js');
const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const fixtures = require('./fixtures.js');
const jwt = require('jsonwebtoken');
const { accessKey } = require('../../controllers/utils/keys/privateKeys.js');

chai.use(chaihttp);
const { expect } = chai;

exports.refreshTests = () => {
  it('Should return new authorization token', done => {
    const { refreshFixture } = fixtures;
    chai
      .request(server)
      .get(refreshFixture.url)
      .set(refreshFixture.headers)
      .send(refreshFixture.body)
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('authorizationToken', 'refreshToken');

        const decodedToken = jwt.verify(res.body.authorizationToken, accessKey);
        expect(refreshFixture.userId).to.equal(decodedToken.userId);
        expect(refreshFixture.email).to.equal(decodedToken.email);
        expect(refreshFixture.role).to.equal(decodedToken.role);

        done();
      });
  });

  it('Should return 401 for unauthorized', done => {
    const { refreshFixtureUnauthorized } = fixtures;
    chai
      .request(server)
      .get(refreshFixtureUnauthorized.url)
      .set(refreshFixtureUnauthorized.headers)
      .send(refreshFixtureUnauthorized.body)
      .end(async (err, res) => {
        expect(res).to.have.status(401);
        const toBe = 'unauthorized';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 409 for black listed or expired refresh token(not in table)', done => {
    const { refreshFixture409 } = fixtures;
    chai
      .request(server)
      .get(refreshFixture409.url)
      .set(refreshFixture409.headers)
      .send(refreshFixture409.body)
      .end(async (err, res) => {
        expect(res).to.have.status(409);
        const toBe = 'invalid refresh token';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });
};
