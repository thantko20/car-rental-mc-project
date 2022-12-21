const generateValidator = require('../../helpers/generateValidator');
const z = require('zod');

const schema = z.object({
  startDate: z.date({ invalid_type_error: 'Invalid Date' }).optional(),
  endDate: z.coerce.date({
    required_error: 'End Date is required',
    invalid_type_error: 'Invalid Date',
  }),
  car: z.string({
    required_error: 'Car is required',
    invalid_type_error: 'Car ID must be string.',
  }),
  totalAmount: z.coerce.number({
    required_error: 'Must not be empty',
    invalid_type_error: 'Must be a number',
  }),
});
const optionalRentalSchema = schema.partial();

const validateRentalCreation = generateValidator(schema);

module.exports = {
  validateRentalCreation,
  optionalRentalSchema,
};
