const { body } = require('express-validator');
const generateValidator = require('../../helpers/generateValidator');

const schemas = [
  body('email').isEmail().withMessage('Invalid email.'),
  body('password').notEmpty().withMessage('Invalid Password'),
];

const validateUserLogin = generateValidator(schemas);

module.exports = validateUserLogin;
