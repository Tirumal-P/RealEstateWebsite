const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  dob: Date,
  phone: String,
  occupation: String,
  annualIncome: Number,
  address: String,
  SSN: { type: String, unique: true },
});

module.exports = mongoose.model('Customer', customerSchema);