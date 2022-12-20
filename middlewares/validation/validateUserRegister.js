const { body } = require('express-validator');
const generateValidator = require('../../helpers/generateValidator');
const UserModel = require('../../models/userModel');

const schemas = [
  body('name')
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('Name must have alphabets only')
    .trim()
    .isLength({ min: 1 }),
  body('email')
    .isEmail()
    .withMessage('Invalid Email')
    .custom(async (value) => {
      const user = await UserModel.findOne({ email: value });
      if (user) {
        return Promise.reject('Email already exists.');
      }

      return true;
    }),
  body('phoneNumber')
    .isAlphanumeric()
    .withMessage('Invalid Phone Number')
    .isLength({ min: 4, max: 12 })
    .withMessage(
      'Phone Number must have at least 4 characters and maximum of 12 characters',
    ),
  body('role').isIn(['CUSTOMER', 'ADMIN']).withMessage('Invalid Role'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password Length should be between 8 and 16 characters.'),
];

const validateUserRegister = generateValidator(schemas);

module.exports = validateUserRegister;
