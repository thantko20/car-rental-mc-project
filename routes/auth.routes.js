const { createController } = require('awilix-express');

const authenticate = require('../middlewares/authenticate');
const {
  validateUserRegister,
} = require('../middlewares/validation/validateUserRegister');
const validateUserLogin = require('../middlewares/validation/validateUserLogin');
const authController = require('../controllers/auth.controller');

module.exports = createController(authController)
  .prefix('/auth')
  .post('/login', 'login', {
    before: [validateUserLogin],
  })
  .post('/register', 'register', {
    before: [validateUserRegister],
  })
  .post('/status', 'getStatus', {
    before: [authenticate],
  })
  .post('/forgot-password', 'forgotPassword')
  .patch('/reset-password/:token', 'resetPassword');
