const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  startDate: { type: Date, default: Date.now() },
  endDate: { type: Date, required: true },
  car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  lessee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalAmount: { type: Number, required: true },
});

rentalSchema.pre(/^find/, populateFields);

const RentalModel = mongoose.model('Rental', rentalSchema);

function populateFields(next) {
  this.populate('lessee', '-password -salt').populate('car');
  next();
}

module.exports = RentalModel;
