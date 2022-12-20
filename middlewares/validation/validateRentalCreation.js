const { body } = require('express-validator');
const CarModel = require('../../models/carModel');
const generateValidator = require('../../helpers/generateValidator');
// const RentalModel = require('../../models/rentalModel');

const schema = [
  body('startDate').isDate().withMessage('Must be a valid date').optional(),
  body('endDate').isDate().withMessage('Must be a valid date'),
  body('car').custom(async (value) => {
    const car = await CarModel.findById(value);
    if (!car || car.status !== 'available') {
      return Promise.reject('Car is not available.');
    }

    return true;
  }),
  body('totalAmount').isNumeric().withMessage('Amount should be number.'),
];

const validateRentalCreation = generateValidator(schema);

module.exports = validateRentalCreation;
