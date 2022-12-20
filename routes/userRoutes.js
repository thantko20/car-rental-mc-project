const {
  getUsers,
  sanitizeUserCredentials,
  deleteUser,
  getUser,
} = require('../controllers/userController');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyToken = require('../middlewares/verifyToken');

const router = require('express').Router();

router.route('/').get(verifyToken, sanitizeUserCredentials, getUsers);

router
  .route('/:id')
  .get(verifyToken, sanitizeUserCredentials, getUser)
  .delete(verifyAdmin, deleteUser);

module.exports = router;
