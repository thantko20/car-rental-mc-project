const {
  getUsers,
  sanitizeUserCredentials,
  deleteUser,
  getUser,
} = require('../controllers/userController');
const attachUser = require('../middlewares/attachUser');
const restrictRoles = require('../middlewares/restrictRoles');
const verifyToken = require('../middlewares/verifyToken');

const router = require('express').Router();

router
  .route('/')
  .get(verifyToken, attachUser, sanitizeUserCredentials, getUsers);

router
  .route('/:id')
  .get(verifyToken, attachUser, sanitizeUserCredentials, getUser)
  .delete(restrictRoles(['ADMIN']), deleteUser);

module.exports = router;
