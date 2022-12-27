<<<<<<< HEAD
const { login, register } = require('../controllers/authController');
const hashPassword = require('../middlewares/hashPassword');
const {
  validateUserRegister,
  optionalSchema,
} = require('../middlewares/validation/validateUserRegister');
=======
const {
  login,
  register,
  getStatus,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');
const validateUserRegister = require('../middlewares/validation/validateUserRegister');
>>>>>>> main
const validateUserLogin = require('../middlewares/validation/validateUserLogin');

const router = require('express').Router();

router.post('/login', validateUserLogin, login);

router.post('/register', validateUserRegister, register);

router.post('/status', verifyToken, getStatus);

router.post('/forgot-password', forgotPassword);

router.patch('/reset-password/:token', resetPassword);

module.exports = router;
