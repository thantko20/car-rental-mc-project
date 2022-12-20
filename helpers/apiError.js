class ApiError extends Error {
  constructor(message, statusCode, errorType = undefined, errors = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, errorType = undefined) {
    return new ApiError(message, 400, errorType);
  }

  static notAuthenticated(message = 'Not Authenticated') {
    return new ApiError(message, 401);
  }

  static notFound(message) {
    return new ApiError(message, 404);
  }

  static validationError(message, errors) {
    return new ApiError(message, 400, 'ValidationError', errors);
  }
}

module.exports = ApiError;
