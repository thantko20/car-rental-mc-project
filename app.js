const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const { NODE_ENV } = require('./constants');
const ApiError = require('./helpers/apiError');
const errorHandler = require('./middlewares/errorHandler');
const carRoutes = require('./routes/carRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const rentalRoutes = require('./routes/rentalRoutes');

const app = express();

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  cors({
    origin: ['*'],
  }),
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
