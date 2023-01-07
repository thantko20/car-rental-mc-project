const withAsyncCatcher = require('../helpers/withAsyncCatcher');
const { NODE_ENV, JWT_COOKIE_EXPIRES } = require('../constants');
const ApiError = require('../helpers/apiError');

module.exports = function makeAuthController({ authService, mailService }) {
  const sendAuthToken = (payload, token, res) => {
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
  };
  return {
    register: withAsyncCatcher(async (req, res, next) => {
      await authService.register(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          user: null,
        },
      });
    }),

    login: withAsyncCatcher(async (req, res, next) => {
      const { user, token } = await authService.login(req.body);

      sendAuthToken({ user }, token, res);
    }),

    forgotPassword: withAsyncCatcher(async (req, res, next) => {
      const { user, message } = await authService.forgotPassword({
        email: req.body.email,
        req,
      });
      try {
        await mailService.sendEmail({
          email: user.email,
          message,
          subject: 'Passowrd Reset for Car Rental Account.',
        });
      } catch (error) {
        await authService.forgotPasswordError(user.id);
        return next(error);
      }

      res.status(204).end();
    }),

    getStatus: withAsyncCatcher(async (req, res, next) => {
      if (!req.user) {
        return next(ApiError.notAuthenticated('Not logged in.'));
      }

      res.json({
        status: 'success',
        data: {
          user: req.user,
        },
      });
    }),

    resetPassword: withAsyncCatcher(async (req, res, next) => {
      await authService.resetPassword(req.body.password, req.params.token);

      res.status(204).end();
    }),
  };
};
