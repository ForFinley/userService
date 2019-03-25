const { server } = require('../../app.js');
const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const fixtures = require('./fixtures.js');

chai.use(chaihttp);
const { expect } = chai;

exports.profileTests = () => {
  it('Should return profile for user', done => {
    const { profileFixture } = fixtures;
    chai
      .request(server)
      .get(profileFixture.url)
      .set(profileFixture.headers)
      .send(profileFixture.body)
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys(
          'userId',
          'email',
          'billingAddress',
          'creditCard',
          'emailVerified'
        );
        done();
      });
  });

  it('Should return 401 for invalid jwt(unauthorized)', done => {
    const { profileFixtureBadToken } = fixtures;
    chai
      .request(server)
      .get(profileFixtureBadToken.url)
      .set(profileFixtureBadToken.headers)
      .send(profileFixtureBadToken.body)
      .end(async (err, res) => {
        expect(res).to.have.status(401);
        const toBe = 'Unauthorized';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });

  it('Should return 500 for token with user that doesnt exist(This should be impossible)', done => {
    const { profileFixtureBadUser } = fixtures;
    chai
      .request(server)
      .get(profileFixtureBadUser.url)
      .set(profileFixtureBadUser.headers)
      .send(profileFixtureBadUser.body)
      .end(async (err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'user not found';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });
};
