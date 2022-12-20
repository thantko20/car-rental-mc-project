const z = require('zod');
const generateValidator = require('../../helpers/generateValidator');

const schema = z.object({
  email: z.string().email('Invalid Email'),
  password: z
    .string()
    .min(8, 'Password must be between 7 - 17 characters.')
    .max(16, 'Password must be between 7 - 17 characters.'),
});

const validateUserLogin = generateValidator(schema);

module.exports = validateUserLogin;
