// Token will be sent in the headers
// 'authorization': 'Bearer <TOKEN>'
const jwt = require('jsonwebtoken');
const withAsyncCatcher = require('../helpers/withAsyncCatcher');
const ApiError = require('../helpers/apiError');
const { JWT_SECRET } = require('../constants');
const UserModel = require('../models/userModel');
const excludeFields = require('../helpers/excludeFields');

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

  jwt.verify(token, JWT_SECRET, async (error, decoded) => {
    if (error) return next(apiError);

    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return next(apiError);
    }

    req.user = excludeFields(user, 'password', 'salt');
    next();
  });
});

function parseToken(string) {
  const token = string.replace('Bearer ', '');

  return token;
}

module.exports = verifyToken;
