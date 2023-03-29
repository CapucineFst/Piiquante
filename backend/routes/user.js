const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

// Post routes that will be used for the signup and the login of the user
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;