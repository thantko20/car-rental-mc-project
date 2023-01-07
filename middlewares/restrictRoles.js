const ApiError = require('../helpers/apiError');
const verifyToken = require('./authenticate');
const attachUser = require('./attachUser');

const restrictRoles = (roles) => {
  return [
    verifyToken,
    attachUser,
    (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(new ApiError('Not Authorized', 403));
      }

      next();
    },
  ];
};

module.exports = restrictRoles;
