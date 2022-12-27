const mongoose = require('mongoose');

const genHashAndSalt = require('../helpers/genHashAndSalt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true, minLength: 2 },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, enum: ['CUSTOMER', 'ADMIN'] },
  password: { type: String, required: true, select: false },
  salt: { type: String, required: true, select: false },
  rentals: [{ type: Schema.Types.ObjectId, ref: 'Rental' }],
  passwordResetToken: String,
  passwordResetExpires: Date,
  changedPasswordAt: Date,
});

<<<<<<< HEAD
userSchema.pre('validate', async function (next) {
  // if (this.isModified('password')) next();
  console.log('Hey');

  const { password, salt } = await genHashAndSalt(
    this.password,
    parseInt(SALT_ROUNDS, 10),
  );
=======
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  const { password, salt } = await genHashAndSalt(this.password);
>>>>>>> main
  this.password = password;
  this.salt = salt;
  next();
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
