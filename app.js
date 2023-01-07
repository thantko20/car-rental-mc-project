const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const { NODE_ENV } = require('./constants');
const ApiError = require('./helpers/apiError');
const errorHandler = require('./middlewares/errorHandler');
const { scopePerRequest, loadControllers } = require('awilix-express');
const container = require('./container');

const app = express();

app.use(helmet());

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an a hour.',
});

app.use(
  cors({
    origin: ['*'],
  }),
);
app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
app.use(express.static(path.join(__dirname, 'public')));

app.use(scopePerRequest(container));
app.use('/api/v1', loadControllers('routes/*.routes.js', { cwd: __dirname }));

app.all('*', (req, res, next) => {
  const error = ApiError.notFound(`Invalid endpoint: ${req.originalUrl}`);
  next(error);
});
app.use(errorHandler);

module.exports = app;
