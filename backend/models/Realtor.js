const mongoose = require('mongoose');

const realtorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  managedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Realtor', realtorSchema);