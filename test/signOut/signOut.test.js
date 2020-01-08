const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const { server } = require('../../app');
const fixtures = require('./fixtures');
const { getRefreshToken } = require('../dynamodbLocal');

chai.use(chaihttp);
const { expect } = chai;

exports.signOutTests = () => {
  it('Should sign out a user', done => {
    const { signOutFixture } = fixtures;
    chai
      .request(server)
      .get(signOutFixture.url)
      .set(signOutFixture.headers)
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        const toBe = 'Sign out complete!';
        expect(res.body.message).to.equal(toBe);

        const refreshRecordAfter = await getRefreshToken(signOutFixture.headers.authorization);
        expect(refreshRecordAfter).to.equal(false);
        done();
      });
  });
};
