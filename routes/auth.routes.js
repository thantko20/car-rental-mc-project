const router = require('express').Router();

const verifyToken = require('../middlewares/verifyToken');
const {
  validateUserRegister,
} = require('../middlewares/validation/validateUserRegister');
const validateUserLogin = require('../middlewares/validation/validateUserLogin');
const container = require('../container');

const { login, register, forgotPassword, getStatus, resetPassword } =
  container.resolve('authController');

router.post('/login', validateUserLogin, login);

router.post('/register', validateUserRegister, register);

router.post('/status', verifyToken, getStatus);

router.post('/forgot-password', forgotPassword);

router.patch('/reset-password/:token', resetPassword);

module.exports = router;
