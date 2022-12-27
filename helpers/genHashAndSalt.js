const bcrypt = require('bcrypt');

const { SALT_ROUNDS } = require('../constants');

const genHashAndSalt = async (plainText) => {
  const salt = await bcrypt.genSalt(parseInt(SALT_ROUNDS, 10));
  const password = await bcrypt.hash(plainText, salt);

  return { salt, password };
};

module.exports = genHashAndSalt;
