const CarModel = require('../../models/carModel')();
const generateValidator = require('../../helpers/generateValidator');
const z = require('zod');
const atLeastOneDefined = require('./atLeastOneDefined');

const schema = z.object({
  color: z
    .string()
    .trim()
    .regex(/^[a-zA-Z]*$/, 'Color must contain alphabets.'),
  licenseNumber: z
    .string()
    .trim()
    .refine(async (value) => {
      const car = await CarModel.findOne({ licenseNumber: value });
      return !car;
    }, 'License Number already exists.'),
  brand: z
    .string()
    .trim()
    .regex(/^[a-zA-Z ]*$/, 'Brand must be alphabets.'),
  yearOfProduction: z.coerce.number({
    required_error: 'Year of Production is required',
    invalid_type_error: 'Must be a number.',
  }),
  model: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9 ]*$/, 'Model must be alphanumeric'),
  basePrice: z.coerce.number({
    required_error: 'Base Price is required.',
    invalid_type_error: 'Must be a number',
  }),
});
const optionalCarSchema = schema.partial().refine(atLeastOneDefined);

const validateCarCreation = generateValidator(schema);

module.exports = {
  validateCarCreation,
  optionalCarSchema,
};
