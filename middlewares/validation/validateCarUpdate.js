const { body } = require('express-validator');
const CarModel = require('../../models/carModel');
const generateValidator = require('../../helpers/generateValidator');

const schemas = [
  body('color')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Color must be provided')
    .isAlpha(),
  body('licenseNumber')
    .optional()
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
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Brand must be provided')
    .isAlphanumeric('en-US', { ignore: ' ' }),
  body('yearOfProduction')
    .optional()
    .isNumeric()
    .withMessage('Year must be in number.'),
  body('model')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Model must be provided')
    .isAlphanumeric('en-US', { ignore: ' ' }),
  body('status').optional().isIn(['available', 'busy', 'maintenence']),
];

const validateCarUpdate = generateValidator(schemas);

module.exports = validateCarUpdate;
