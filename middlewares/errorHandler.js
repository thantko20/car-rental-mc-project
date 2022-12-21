const ApiError = require('../helpers/apiError');
const { NODE_ENV } = require('../constants');

const errorHandler = (error, req, res, next) => {
  if (NODE_ENV === 'development') {
    console.error(error);
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      status: 'failure',
      message: error.message,
      errorType: error.errorType,
      errors: error.errors,
      stack: NODE_ENV === 'development' ? error.stack : undefined,
    });

    return;
  }

  res.status(500).json({
    status: 'failure',
    message: 'Something went wrong.',
  });
};

module.exports = errorHandler;
