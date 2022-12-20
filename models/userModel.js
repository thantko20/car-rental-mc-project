const mongoose = require('mongoose');
const genHashAndSalt = require('../helpers/genHashAndSalt');
const { SALT_ROUNDS } = require('../constants');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true, minLength: 2 },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, enum: ['CUSTOMER', 'ADMIN'] },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  rentals: [{ type: Schema.Types.ObjectId, ref: 'Rental' }],
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) next();

  const { password, salt } = await genHashAndSalt(this.password, SALT_ROUNDS);
  this.password = password;
  this.salt = salt;
  next();
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
