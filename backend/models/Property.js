const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['apartment', 'house', 'plot'], required: true },
  status: { type: String, enum: ['available', 'sold'], default: 'available' },
  bhk: Number,
  images: [String],
  area: Number,
  price: { type: Number, required: true },
  location: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  realtor: { type: mongoose.Schema.Types.ObjectId, ref: 'Realtor' },
  interestedCustomers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }]
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);