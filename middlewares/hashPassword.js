const withAsyncCatcher = require('../helpers/withAsyncCatcher');
const genHashAndSalt = require('../helpers/genHashAndSalt');
const { SALT_ROUNDS } = require('../constants');

const hashPassword = withAsyncCatcher(async (req, res, next) => {
  const { password, salt } = await genHashAndSalt(
    req.body.password,
    parseInt(SALT_ROUNDS, 10),
  );

  req.body.password = password;
  req.body.salt = salt;

  next();
});

module.exports = hashPassword;
