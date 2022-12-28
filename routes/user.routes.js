const restrictRoles = require('../middlewares/restrictRoles');
const sanitizeUserRoutes = require('../middlewares/sanitizeUserRoute');
const verifyToken = require('../middlewares/verifyToken');
const container = require('../container');

const {
  getUsers,
  deleteUser,
  getUser,
  attachUser,
  updateUser,
  checkOwnUserIdOrAdmin,
} = container.resolve('userController');

const router = require('express').Router();

router.all(sanitizeUserRoutes);

router.route('/').get(verifyToken, attachUser, getUsers);

router
  .route('/:id')
  .get(verifyToken, attachUser, getUser)
  .delete(restrictRoles(['ADMIN']), checkOwnUserIdOrAdmin, deleteUser)
  .patch(verifyToken, attachUser, checkOwnUserIdOrAdmin, updateUser);

module.exports = router;
