const generateValidator = require('../../helpers/generateValidator');
const { optionalCarSchema } = require('./validateCarCreation');

const schema = [
  body('startDate').isDate().withMessage('Must be a valid date').optional(),
  body('endDate').isDate().withMessage('Must be a valid date').optional(),
  body('car')
    .optional()
    .custom(async (value) => {
      // const rentalWithCarIdExists = await RentalModel.findOne({ car: value });
      // if (rentalWithCarIdExists) {
      //   return Promise.reject('Car is not available.');
      // }
      // return true;
      const car = await CarModel.findById(value);
      if (!car || car.status !== 'available') {
        return Promise.reject('Car is not available.');
      }

      return true;
    }),
  body('totalAmount')
    .optional()
    .isNumeric()
    .withMessage('Amount should be number.'),
];

const validateRentalUpdate = generateValidator(schema);

module.exports = validateRentalUpdate;
