const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  dob: Date,
  phone: String,
  occupation: String,
  annualIncome: Number,
  address: String,
  SSN: { type: String, unique: true },
  listedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Owner', ownerSchema);