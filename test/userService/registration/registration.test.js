const { server } = require('../../../app.js');
const chai = require('chai');
const chaihttp = require('chai-http');
const { it } = require('mocha');
const { userInDynamo, deleteUserInDynamo } = require('../../helpers.js');

chai.use(chaihttp);
const { expect } = chai;

exports.registrationTests = () => {
  it('Shoud register a new user', done => {
    chai
      .request(server)
      .post('/userService/registration')
      // .set(genericGoogleSigninRequest.headers)
      .send({
        email: 'test@testGmail.com',
        password: 'test'
      })
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
};

// afterAll(() => server.close());

// describe("/userService/Registration", () => {
//   it("Register a new user", async () => {
//     let res = await request(server)
//       .post("/userService/registration")
//       .send({
//         email: "test@testGmail.com",
//         password: "test"
//       });
//     console.log(res.body);
//     // expect(response.body).toEqual(['Elie', 'Matt', 'Joel', 'Michael']);
//     expect(res.statusCode).toBe(200);
//     deleteUserInDynamo(res.body.userId);
//   });
// });
