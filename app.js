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
const carRoutes = require('./routes/carRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const rentalRoutes = require('./routes/rentalRoutes');

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

// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/cars', carRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/rentals', rentalRoutes);

app.all('*', (req, res, next) => {
  const error = ApiError.notFound(`Invalid endpoint: ${req.originalUrl}`);
  next(error);
});
app.use(errorHandler);

module.exports = app;
