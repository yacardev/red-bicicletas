const express = require('express');
const router = express.Router();

const authController = require('../../controllers/api/authControllerAPI');

router.post('/authenticate', authController.authenticate);
router.post('/resetpassword', authController.resetPassword);

module.exports = router;