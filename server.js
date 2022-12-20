require('dotenv').config({ path: './.env' });
const app = require('./app');
const mongoose = require('mongoose');
const { PORT, MONGO_URI } = require('./constants');

process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception');
  console.log(error.name, error.message);
});

mongoose.set('strictQuery', false);

mongoose
  .connect(MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('Connection to MongoDB established.'));

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`),
);

process.on('unhandledRejection', (error) => {
  console.log('Unhandled Rejection!');
  console.log(error.name, error.message);

  server.close(() => {
    process.exit(1);
  });
});
