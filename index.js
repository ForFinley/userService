const identityService = require('./routes');
const { authenticate, authRole } = require('./middlewares/authenticate');

module.exports = {
  identityService,
  authenticate,
  authRole,
};
