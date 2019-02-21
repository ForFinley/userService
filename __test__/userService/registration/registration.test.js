const server = require("../../../app.js");
const request = require("supertest");
const { userInDynamo, deleteUserInDynamo } = require("../../helpers.js");

describe("/userService/Registration", () => {
  it("Register a new user", async done => {
    request(server)
      .post("/userService/registration")
      .send({
        email: "test@testGmail.com",
        password: "test"
      })
      .end(async (err, res) => {
        console.log(res.body);
        // expect(response.body).toEqual(['Elie', 'Matt', 'Joel', 'Michael']);
        expect(res.statusCode).toBe(200);
        deleteUserInDynamo(res.body.userId);
        server.close();
        done();
      });
  });
});
