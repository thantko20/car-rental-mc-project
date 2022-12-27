const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ApiError = require('../helpers/apiError');
const comparePasswords = require('../helpers/comparePasswords');
const withAsyncCatcher = require('../helpers/withAsyncCatcher');
const excludeFields = require('../helpers/excludeFields');
const UserModel = require('../models/userModel');
const {
  JWT_SECRET,
  JWT_COOKIE_EXPIRES,
  NODE_ENV,
  JWT_EXPIRES,
} = require('../constants');
const sendEmail = require('../helpers/emailHandler');

exports.register = withAsyncCatcher(async (req, res, next) => {
  const { password } = req.body;
  const user = new UserModel({ ...req.body, password });
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
  }).select('+password');

  const isValidPassword = comparePasswords(req.body.password, user.password);
  if (!user || !(await isValidPassword)) {
    return next(ApiError.notAuthenticated('Invalid Credentials.'));
  }

  const token = await createJWTToken({ userId: user.id });
  sendAuthToken({ user: excludeFields(user, 'password') }, token, res);
});

exports.getStatus = withAsyncCatcher(async (req, res, next) => {
  res.json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

exports.forgotPassword = withAsyncCatcher(async (req, res, next) => {
  const { token, encryptedToken, expires } = createPasswordToken();
  const { email } = req.body;
  const user = await UserModel.findOneAndUpdate(
    { email },
    { passwordResetToken: encryptedToken, passwordResetExpires: expires },
  );
  if (!user) {
    return next(ApiError.badRequest('Invalid email.'));
  }

  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/reset-password/${token}`;

  const message = `Please visit the link below to reset your passowrd. ${resetUrl}.\nIf you didn't forget your password, just ignore this mail.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset for Car Rental Account.',
      message,
    });
    res.status(204).json();
  } catch (error) {
    await UserModel.updateOne(
      { id: user.id },
      { passwordResetToken: undefined, passwordResetExpires: undefined },
    );
    next(error);
  }
});

exports.resetPassword = withAsyncCatcher(async (req, res, next) => {
  const { password } = req.body;
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(
      ApiError.badRequest('User does not exist or the reset token expires.'),
    );
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.changedPasswordAt = Date.now() - 1000;

  await user.save();
  res.sendStatus(204);
});

function createPasswordToken() {
  const randomHexString = crypto.randomBytes(32).toString('hex');
  const resetToken = crypto
    .createHash('sha256')
    .update(randomHexString)
    .digest('hex');
  const resetMaxAge = Date.now() + 1000 * 60 * 30;

  return {
    token: randomHexString,
    encryptedToken: resetToken,
    expires: resetMaxAge,
  };
}

function createJWTToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES },
      (error, token) => {
        if (error) return reject(error);

        resolve(token);
      },
    );
  });
}

function sendAuthToken(payload, token, res) {
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    secure: NODE_ENV === 'production' ? true : false,
    httpOnly: true,
  };
  res.cookie('jwt', token, cookieOptions);
  res.json({
    status: 'success',
    data: {
      ...payload,
      token,
    },
  });
}
