const database = require('../utils/mongoUser.js');
const httpUtil = require('../utils/httpUtil.js');

module.exports.handler = async function (req, res) {
    console.log("Starting function allUsers...");
    try {
        let users = await database.queryAllUsers();

        let result = {
            Items: users
        }
        return res.send(httpUtil.createResponse(200, result));
    }
    catch (e) {
        console.log('**ERROR** ', e);
        return res.status(500).send(httpUtil.createResponse(500, "Internal Server Error."));
    }
}