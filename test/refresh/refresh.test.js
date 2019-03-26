const { server } = require('../../app.js');
const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const fixtures = require('./fixtures.js');

chai.use(chaihttp);
const { expect } = chai;

exports.refreshTests = () => {
  it('Should ', done => {
    const { refreshFixture } = fixtures;
    chai
      .request(server)
      .get(refreshFixture.url)
      .set(refreshFixture.headers)
      .send(refreshFixture.body)
      .end(async (err, res) => {
        console.log(res.body);
        // expect(res).to.have.status(200);
        // expect(res.body).to.have.all.keys(
        //   'userId',
        //   'email',
        //   'billingAddress',
        //   'creditCard',
        //   'emailVerified'
        // );
        done();
      });
  });
};
