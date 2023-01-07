const restrictRoles = require('../middlewares/restrictRoles');
const sanitizeUserRoutes = require('../middlewares/sanitizeUserRoute');
const authenticate = require('../middlewares/authenticate');
const attachUser = require('../middlewares/attachUser');
const checkOwnUserIdOrAdmin = require('../middlewares/checkOwnUserIdOrAdmin');
const { createController } = require('awilix-express');
const userController = require('../controllers/user.controller');

// module.exports = router;
module.exports = createController(userController)
  .prefix('/users')
  .all(sanitizeUserRoutes)
  .get('', 'getUsers', { before: [authenticate, attachUser] })
  .get('/:id', 'getUser', { before: [authenticate, attachUser] })
  .delete('/:id', 'deleteUser', { before: [restrictRoles('ADMIN')] })
  .patch('/:id', 'updateUser', {
    before: [authenticate, attachUser, checkOwnUserIdOrAdmin],
  });
