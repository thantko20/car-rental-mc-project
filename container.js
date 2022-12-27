const awilix = require('awilix');

const makeAuthService = require('./services/auth.service');
const makeAuthController = require('./controllers/auth.controller');
const UserModel = require('./models/userModel');

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
  userModel: awilix.asValue(UserModel),
  authService: awilix.asFunction(makeAuthService),
  authController: awilix.asFunction(makeAuthController),
});

module.exports = container;
