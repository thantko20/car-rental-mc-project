const restrictRoles = require('../middlewares/restrictRoles');
const sanitizeUserRoutes = require('../middlewares/sanitizeUserRoute');
const verifyToken = require('../middlewares/verifyToken');
const container = require('../container');

const { getUsers, deleteUser, getUser, attachUser, updateUser } =
  container.resolve('userController');

const router = require('express').Router();

router.all(sanitizeUserRoutes);

router.route('/').get(verifyToken, attachUser, getUsers);

router
  .route('/:id')
  .get(verifyToken, attachUser, getUser)
  .delete(restrictRoles(['ADMIN']), deleteUser)
  .patch(verifyToken, attachUser, updateUser);

module.exports = router;
