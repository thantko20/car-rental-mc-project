const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carSchema = new Schema({
  color: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  yearOfProduction: { type: Number, required: true },
  model: { type: String, required: true },
  status: {
    type: String,
    default: 'available',
    enum: ['available', 'busy', 'maintenence'],
  },
  basePrice: {
    type: Number,
    default: 80000,
  },
  image: {
    type: String,
    required: true,
  },
  rentals: [{ type: Schema.Types.ObjectId, ref: 'Rental' }],
});

module.exports = () => mongoose.model('Car', carSchema);
