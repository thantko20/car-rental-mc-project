const ApiError = require('../helpers/apiError');

module.exports = (req, res, next) => {
  const userId = req.params.id;

  if (userId !== req.user.id || req.user.role !== 'ADMIN') {
    return next(new ApiError('Not authorized.', 403));
  }
  next();
};
