const express = require('express');
const {
	handleUserLogin,
	handleUserSignUp,
} = require('../controllers/authController');
const authRouter = express.Router();

authRouter.post('/login', handleUserLogin);
authRouter.post('/signup', handleUserSignUp);

module.exports = authRouter;
