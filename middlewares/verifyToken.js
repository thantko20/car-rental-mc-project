// Token will be sent in the headers
// 'authorization': 'Bearer <TOKEN>'
const jwt = require('jsonwebtoken');
const withAsyncCatcher = require('../helpers/withAsyncCatcher');
const ApiError = require('../helpers/apiError');
const { JWT_SECRET } = require('../constants');
const UserModel = require('../models/userModel');

const verifyToken = withAsyncCatcher(async (req, res, next) => {
  const authorization = req.headers['authorization'];
  const apiError = ApiError.notAuthenticated();
  if (!authorization) {
    return next(apiError);
  }
  const token = parseToken(req.headers['authorization']);
  if (!token) {
    return next(apiError);
  }

  const decoded = await jwtVerify(token);

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    return next(apiError);
  }

  const isTokenOlderThanLastPasswordChange =
    user.changedPasswordAt && decoded.iat * 1000 < user.changedPasswordAt;

  if (isTokenOlderThanLastPasswordChange) {
    return next(
      ApiError.notAuthenticated('Session Expired. Please login again.'),
    );
  }

  req.user = user;
  next();
});

function jwtVerify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) return reject(error);

      resolve(decoded);
    });
  });
}

function parseToken(string) {
  const token = string.replace('Bearer ', '');

  return token;
}

module.exports = verifyToken;
