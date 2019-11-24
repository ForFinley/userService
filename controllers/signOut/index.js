const { deleteRefreshRecord } = require('../utils/database.js');
const { resolveErrorSendResponse } = require('../utils/errors.js');

module.exports.handler = async function(req, res) {
  try {
    const refreshToken = req.headers.authorization;

    await deleteRefreshRecord(refreshToken);
    res.status(200).send({ message: 'Sign out complete!' });
  } catch (e) {
    resolveErrorSendResponse(e, res);
  }
};
