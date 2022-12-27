const router = require('express').Router();

const {
  login,
  register,
  getStatus,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');
const {
  validateUserRegister,
} = require('../middlewares/validation/validateUserRegister');
const validateUserLogin = require('../middlewares/validation/validateUserLogin');

router.post('/login', validateUserLogin, login);

router.post('/register', validateUserRegister, register);

router.post('/status', verifyToken, getStatus);

router.post('/forgot-password', forgotPassword);

router.patch('/reset-password/:token', resetPassword);

module.exports = router;
