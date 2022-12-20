const { login, register } = require('../controllers/authController');
const hashPassword = require('../middlewares/hashPassword');
const {
  validateUserRegister,
  optionalSchema,
} = require('../middlewares/validation/validateUserRegister');
const validateUserLogin = require('../middlewares/validation/validateUserLogin');

const router = require('express').Router();

router.post('/login', validateUserLogin, login);

router.post('/register', validateUserRegister, register);

module.exports = router;
