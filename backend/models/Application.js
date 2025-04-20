const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  fullname: {type: String, required:true},
  email: String,
  phonenumber: String,
  SSN: Number,
  employerName: String,
  employementstatus: String,
  annualincome: Number,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  documents: {
    proofOfEmployment: String,
    governmentId: String,
    proofOfAddress: String,
    bankStatement: String
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Realtor' }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);