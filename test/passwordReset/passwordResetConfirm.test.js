const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const { server } = require('../../app');
const fixtures = require('./fixtures');
const { getUser } = require('../dynamodbLocal');

chai.use(chaihttp);
const { expect } = chai;

exports.passwordResetConfirmTests = () => {
  it('Should confirm reset password', done => {
    const { resetPasswordConfirm } = fixtures;
    chai
      .request(server)
      .post(resetPasswordConfirm.url)
      .set(resetPasswordConfirm.headers)
      .send(resetPasswordConfirm.body)
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        const toBe = 'Password update success!';
        expect(res.body.message).to.equal(toBe);
        const userAfter = await getUser(resetPasswordConfirm.userId);
        expect(resetPasswordConfirm.password).to.not.equal(userAfter.password);
        done();
      });
  });

  it('Should return 400 for invalid user', done => {
    const { resetPasswordConfirmInvalidUser } = fixtures;
    chai
      .request(server)
      .post(resetPasswordConfirmInvalidUser.url)
      .set(resetPasswordConfirmInvalidUser.headers)
      .send(resetPasswordConfirmInvalidUser.body)
      .end(async (err, res) => {
        expect(res).to.have.status(400);
        const toBe = 'invalid user';
        expect(res.body.message).to.equal(toBe);
        done();
      });
  });
};
