// const { body } = require('express-validator');
const z = require('zod');
const generateValidator = require('../../helpers/generateValidator');
const UserModel = require('../../models/userModel');

const schema = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[a-zA-Z ]*$/, 'Must only contains letters.'),
  email: z
    .string()
    .email('Invalid Email')
    .refine(async (value) => {
      const user = await UserModel.findOne({ email: value });
      return !user;
    }, 'Email already exists.'),
  phoneNumber: z
    .string()
    .min(8, 'Phone Number must have at least 8 characters.')
    .regex(/^[a-zA-Z0-9]*$/),
  role: z.enum(['ADMIN', 'CUSTOMER'], {
    invalid_type_error: 'Invalid Role.',
  }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters.'),
});
const optionalSchema = schema.partial();

const validateUserRegister = generateValidator(schema);

module.exports = {
  validateUserRegister,
  optionalSchema,
};
