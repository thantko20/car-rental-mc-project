const withAsyncCatcher = require('../helpers/withAsyncCatcher');

module.exports.sanitizeUserRoute = withAsyncCatcher(async (req, res, next) => {
  req.query.fields =
    req.query.fields && req.query.fields.replace(/\b(password|salt)\b/g, '');
  next();
});
