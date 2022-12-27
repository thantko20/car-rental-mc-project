const {
  getUsers,
  sanitizeUserCredentials,
  deleteUser,
  getUser,
} = require('../controllers/userController');
const restrictRoles = require('../middlewares/restrictRoles');
const verifyToken = require('../middlewares/verifyToken');

const router = require('express').Router();

router.route('/').get(verifyToken, sanitizeUserCredentials, getUsers);

router
  .route('/:id')
  .get(verifyToken, sanitizeUserCredentials, getUser)
  .delete(restrictRoles(['ADMIN']), deleteUser);

module.exports = router;
