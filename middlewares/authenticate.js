// Token will be sent in the headers
// 'authorization': 'Bearer <TOKEN>'
const jwt = require('jsonwebtoken');
const withAsyncCatcher = require('../helpers/withAsyncCatcher');
const ApiError = require('../helpers/apiError');
const { JWT_SECRET } = require('../constants');

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
  req.token = decoded;
  return next();
});

function jwtVerify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return reject(
            ApiError.notAuthenticated('Login expired. Please log in again.'),
          );
        }

        return reject(error);
      }

      resolve(decoded);
    });
  });
}

function parseToken(string) {
  const token = string.replace('Bearer ', '');

  return token;
}

module.exports = verifyToken;
