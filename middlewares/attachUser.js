const withAsyncCatcher = require('../helpers/withAsyncCatcher');
const ApiError = require('../helpers/apiError');
const userModel = require('../container').resolve('userModel');

const attachUser = withAsyncCatcher(async (req, res, next) => {
  const decodedToken = req.token;

  const user = await userModel.findById(decodedToken.userId);

  if (!user) {
    return next(ApiError.notAuthenticated('Invalid User'));
  }

  const isTokenOlderThanLastPasswordChange =
    user.changedPasswordAt && decodedToken.iat * 1000 < user.changedPasswordAt;

  if (isTokenOlderThanLastPasswordChange) {
    return next(
      ApiError.notAuthenticated('Session Expired. Please login again.'),
    );
  }

  req.user = user;
  next();
});

module.exports = attachUser;
