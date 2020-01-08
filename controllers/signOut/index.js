const { deleteRefreshRecord } = require('../utils/database');
const { resolveErrorSendResponse } = require('../utils/errors');

module.exports.handler = async (req, res) => {
  try {
    const refreshToken = req.headers.authorization;

    await deleteRefreshRecord(refreshToken);
    return res.status(200).send({ message: 'Sign out complete!' });
  } catch (e) {
    return resolveErrorSendResponse(e, res);
  }
};
