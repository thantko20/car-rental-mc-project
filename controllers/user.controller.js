const ApiError = require('../helpers/apiError');
const withAsyncCatcher = require('../helpers/withAsyncCatcher');

module.exports = function makeUserController({ userService }) {
  return {
    getUsers: withAsyncCatcher(async (req, res, next) => {
      const users = await userService.getUsers(req.query);
      res.json({
        status: 'success',
        data: {
          users,
        },
      });
    }),

    getUser: withAsyncCatcher(async (req, res, next) => {
      const user = await userService.getUserById(req.params.id);

      res.json({
        status: 'success',
        data: {
          user,
        },
      });
    }),

    updateUser: withAsyncCatcher(async (req, res, next) => {
      const user = await userService.updateUserById(req.params.id, req.body);

      res.json({
        status: 'succes',
        data: {
          user,
        },
      });
    }),

    deleteUser: withAsyncCatcher(async (req, res, next) => {
      await userService.deleteUserById(req.params.id);

      res.status(204).end();
    }),

    attachUser: withAsyncCatcher(async (req, res, next) => {
      const decodedToken = req.token;

      const user = await userService.getUserById(decodedToken.userId);

      if (!user) {
        return next(ApiError.notAuthenticated('Invalid user'));
      }

      const isTokenOlderThanLastPasswordChange =
        user.changedPasswordAt &&
        decodedToken.iat * 1000 < user.changedPasswordAt;

      if (isTokenOlderThanLastPasswordChange) {
        return next(
          ApiError.notAuthenticated('Session Expired. Please login again.'),
        );
      }

      req.user = user;
      next();
    }),

    checkOwnUserIdOrAdmin: (req, res, next) => {
      const userId = req.params.id;

      if (userId !== req.user.id || req.user.role !== 'ADMIN') {
        return next(new ApiError('Not authorized.', 403));
      }
      next();
    },
  };
};
