const ApiError = require('../helpers/apiError');
const withAsyncCatcher = require('../helpers/withAsyncCatcher');
const UserModel = require('../models/userModel');
const verifyToken = require('./verifyToken');

const verifyAdmin = [
  verifyToken,
  withAsyncCatcher(async (req, res, next) => {
    const userId = req.user._id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return next(ApiError.badRequest('No user found.'));
    }

    if (user.role === 'ADMIN') {
      req.userRole = 'ADMIN';
      return next();
    }

    next(new ApiError('Not Authorized.', 403));
  }),
];

module.exports = verifyAdmin;
