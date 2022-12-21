const generateValidator = require('../../helpers/generateValidator');
const { optionalCarSchema } = require('./validateCarCreation');

const validateCarUpdate = generateValidator(optionalCarSchema);

module.exports = validateCarUpdate;
