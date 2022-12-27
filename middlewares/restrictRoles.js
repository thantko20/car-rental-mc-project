const ApiError = require('../helpers/apiError');
const verifyToken = require('./verifyToken');

const restrictRoles = (roles) => {
  return [
    verifyToken,
    (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(new ApiError('Not Authorized', 403));
      }

      next();
    },
  ];
};

module.exports = restrictRoles;
