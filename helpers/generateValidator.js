const { validationResult } = require('express-validator');
const withAsyncCatcher = require('./withAsyncCatcher');
const ApiError = require('./apiError');

function formatErrors(errors) {
  const formattedErrors = {};
  errors.forEach((error) => (formattedErrors[error.param] = error.msg));
  return formattedErrors;
}

const generateValidator = (schemas) => {
  return withAsyncCatcher(async (req, res, next) => {
    await Promise.all(schemas.map((schema) => schema.run(req)));

    const results = validationResult(req);

    if (results.isEmpty()) {
      return next();
    }

    const errors = formatErrors(results.array());

    const newError = ApiError.validationError('Validation Error', errors);

    next(newError);
  });
};

module.exports = generateValidator;
