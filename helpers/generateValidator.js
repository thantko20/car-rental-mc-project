const ApiError = require('./apiError');
const withAsyncCatcher = require('./withAsyncCatcher');
const formatErrors = require('./formatErrors');

const generateValidator = (schema) => {
  return withAsyncCatcher(async (req, res, next) => {
    const result = await schema.safeParseAsync(req.body);
    if (!result.success) {
      return next(
        ApiError.validationError(
          'Validation Error',
          formatErrors(result.error),
        ),
      );
    }
    next();
  });
};

module.exports = generateValidator;
