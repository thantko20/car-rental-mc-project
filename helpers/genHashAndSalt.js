const bcrypt = require('bcrypt');

const genHashAndSalt = async (plainText, saltRounds) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const password = await bcrypt.hash(plainText, salt);

  return { salt, password };
};

module.exports = genHashAndSalt;
