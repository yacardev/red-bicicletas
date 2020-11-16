const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');

const authController = require('../../controllers/api/authControllerAPI');

router.post('/authenticate', authController.authenticate);
router.post('/resetpassword', authController.resetPassword);
router.post('/facebook_token', passport.authenticate('facebook-token'), authController.authFacebookToken);

module.exports = router;