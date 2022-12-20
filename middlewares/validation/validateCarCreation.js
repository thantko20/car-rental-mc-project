const { body } = require('express-validator');
const CarModel = require('../../models/carModel');
const generateValidator = require('../../helpers/generateValidator');

const schemas = [
  body('color')
    .trim()
    .notEmpty()
    .withMessage('Color must be provided')
    .isAlpha(),
  body('licenseNumber')
    .trim()
    .notEmpty()
    .withMessage('License Number must not be empty')
    .custom(async (value) => {
      const car = await CarModel.findOne({ licenseNumber: value });
      if (car) {
        return Promise.reject('License Number already exists.');
      }
      return true;
    }),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand must be provided')
    .isAlphanumeric('en-US', { ignore: ' ' }),
  body('yearOfProduction').isNumeric().withMessage('Year must be in number.'),
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model must be provided')
    .isAlphanumeric('en-US', { ignore: ' ' }),

  body('image').notEmpty().withMessage('Image URL must be provided.'),
];

const validateCarCreation = generateValidator(schemas);

module.exports = validateCarCreation;
