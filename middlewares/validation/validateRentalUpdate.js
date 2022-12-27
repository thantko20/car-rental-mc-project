const generateValidator = require('../../helpers/generateValidator');
const { optionalCarSchema } = require('./validateCarCreation');

const validateRentalUpdate = generateValidator(optionalCarSchema);

module.exports = validateRentalUpdate;
