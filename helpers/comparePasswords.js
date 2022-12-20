const bcrypt = require('bcrypt');

const comparePasswords = async (plainText, hash) => {
  return await bcrypt.compare(plainText, hash);
};

module.exports = comparePasswords;
