const awilix = require('awilix');

const makeAuthService = require('./services/auth.service');
const makeUserService = require('./services/user.service');

const makeAuthController = require('./controllers/auth.controller');
const makeUserController = require('./controllers/user.controller');

const UserModel = require('./models/userModel');

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

// Models
container.register({
  userModel: awilix.asFunction(UserModel).singleton(),
});

// Services
container.register({
  authService: awilix.asFunction(makeAuthService),
  userService: awilix.asFunction(makeUserService),
});

// Controllers
container.register({
  authController: awilix.asFunction(makeAuthController),
  userController: awilix.asFunction(makeUserController),
});

module.exports = container;
