const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/signin', userController.signin);

router.post('/signup', userController.signup);

router.post('/googleAuth', userController.googleAuth)

module.exports = router;