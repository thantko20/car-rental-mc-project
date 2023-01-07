const awilix = require('awilix');

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

container.loadModules(['services/**/*.service.js', 'models/**/*.js'], {
  formatName: 'camelCase',
});

module.exports = container;
