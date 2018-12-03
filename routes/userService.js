const express = require('express');
const router = express.Router();
const passport = require('passport');
const expressJwt = require('express-jwt');
const secret = require('../utils/keys/privateKey');
const authenticate = expressJwt({secret: secret.key});
const userServiceController = require('../controllers/userService');
  
//Takes in email and password
router.post('/registration', userServiceController.registration);

//Takes in email and password
router.post('/signIn', passport.initialize(), passport.authenticate(
    'local', {
        session: false,
        scope: []
    }), userServiceController.serialize, userServiceController.generateToken, userServiceController.respond);

//Takes in email, password(current), and newPassword
router.post('/changePassword', authenticate, userServiceController.changePassword);

//test
router.get('/me', authenticate, function (req, res) {
    res.status(200).json(req.user);
});

module.exports = router;