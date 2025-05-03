const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  type: { type: String, required: true },
  status: { type: String, required: true },
  contractDate: { type: Date, default: Date.now },
  startDate: Date,
  endDate: Date,
  closingDate: Date,
  salePrice: Number,
  depositAmount: Number,
  paymentTerms: String,
  loanDetails: {
    amount: { type: Number },
    provider: { type: String },
    type: { type: String },
    interestRate: { type: Number },
    approvalDate: { type: Date },
    status: { type: String }
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  realtor: { type: mongoose.Schema.Types.ObjectId, ref: 'Realtor' },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  signatures: {
    owner: String,
    customer: String
  }
});

module.exports = mongoose.model('Contract', contractSchema);