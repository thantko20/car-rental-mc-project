const jwt = require('jsonwebtoken');
const ApiError = require('../helpers/apiError');
const comparePasswords = require('../helpers/comparePasswords');
const withAsyncCatcher = require('../helpers/withAsyncCatcher');
const UserModel = require('../models/userModel');
const { JWT_SECRET } = require('../constants');

exports.register = withAsyncCatcher(async (req, res, next) => {
  const user = new UserModel(req.body);
  await user.save();

  res.status(201).json({
    status: 'success',
    data: {
      user: null,
    },
  });
});

exports.login = withAsyncCatcher(async (req, res, next) => {
  const user = await UserModel.findOne({
    email: req.body.email,
  });

  if (!user) {
    return next(ApiError.badRequest('Invalid Email.'));
  }
  const isSamePasswords = await comparePasswords(
    req.body.password,
    user.password,
  );

  if (!isSamePasswords) {
    return next(ApiError.badRequest('Invalid Password.'));
  }

  jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: '7d' },
    (error, token) => {
      if (error) return next(error);

      res.json({
        status: 'success',
        data: {
          userId: user.id,
          token,
        },
      });
    },
  );
});
