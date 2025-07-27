const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  issuer: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Travel', 'Cashback', 'Rewards', 'Fuel', 'Shopping', 'Premium', 'Business'],
    required: true
  },
  annualFee: {
    type: Number,
    required: true,
    min: 0
  },
  joiningFee: {
    type: Number,
    required: true,
    min: 0
  },
  minIncome: {
    type: Number,
    required: true,
    min: 0
  },
  rewards: {
    type: Map,
    of: Number,
    default: new Map()
  },
  features: [{
    type: String,
    trim: true
  }],
  eligibility: {
    minAge: { type: Number, default: 18 },
    maxAge: { type: Number, default: 65 },
    minCreditScore: { type: Number, default: 650 },
    employmentType: [{ type: String, enum: ['Salaried', 'Self-employed', 'Business', 'Any'] }]
  },
  benefits: [{
    category: String,
    description: String,
    value: String
  }],
  imageUrl: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
cardSchema.index({ issuer: 1, type: 1 });
cardSchema.index({ minIncome: 1 });
cardSchema.index({ annualFee: 1 });
cardSchema.index({ rating: -1 });

module.exports = mongoose.model('Card', cardSchema);