const { server } = require('../../app.js');
const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const fixtures = require('./fixtures.js');
const { getRefreshToken } = require('../dynamodbLocal.js');

chai.use(chaihttp);
const { expect } = chai;

exports.signOutTests = () => {
  it('Shoud sign out a user', done => {
    const { signOutFixture } = fixtures;
    chai
      .request(server)
      .get(signOutFixture.url)
      .set(signOutFixture.headers)
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        const toBe = 'Sign out complete!';
        expect(res.body.message).to.equal(toBe);

        let refreshRecordAfter = await getRefreshToken(
          signOutFixture.headers.authorization
        );
        expect(refreshRecordAfter).to.equal(false);
        done();
      });
  });
};
