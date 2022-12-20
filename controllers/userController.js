const excludeFields = require('../helpers/excludeFields');
const QueryHelper = require('../helpers/queryHelper');
const withAsyncCatcher = require('../helpers/withAsyncCatcher');
const UserModel = require('../models/userModel');
const ApiError = require('../helpers/apiError');

exports.sanitizeUserCredentials = withAsyncCatcher(async (req, res, next) => {
  req.query.fields =
    req.query.fields && req.query.fields.replace(/\b(password|salt)\b/g, '');
  next();
});

exports.getUsers = withAsyncCatcher(async (req, res, next) => {
  const queryHelper = new QueryHelper(UserModel.find(), req.query);

  queryHelper.filter().limitFields().sort();

  const users = await queryHelper.query;

  const sanitizedUsers = users.map((user) =>
    excludeFields(user, 'password', 'salt'),
  );

  res.json({
    status: 'success',
    data: {
      users: sanitizedUsers,
    },
  });
});

exports.getUser = withAsyncCatcher(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return next(ApiError.badRequest('Invalid User ID'));
  }

  res.json({
    status: 'success',
    data: {
      user: excludeFields(user, 'password', 'salt'),
    },
  });
});

exports.updateUser = withAsyncCatcher(async (req, res, next) => {
  const userId = req.params.id;
  if (req.user.id !== userId || req.user.role !== 'ADMIN') {
    return next(new ApiError('Not Authorized', 403));
  }
  const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, {
    new: true,
  });

  if (!updatedUser) {
    return next(ApiError.badRequest('Invalid User ID'));
  }

  const sanitizedUser = excludeFields(updatedUser, 'password', 'salt');

  res.status(201).json({
    status: 'success',
    data: {
      user: sanitizedUser,
    },
  });
});

exports.deleteUser = withAsyncCatcher(async (req, res, next) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(ApiError.badRequest('Invalid User ID'));
  }

  res.json({
    status: 'success',
    data: {
      user: null,
    },
  });
});
