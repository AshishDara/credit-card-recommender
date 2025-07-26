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
    enum: ['credit', 'debit'],
    default: 'credit'
  },
  category: {
    type: String,
    enum: ['cashback', 'travel', 'fuel', 'shopping', 'premium', 'lifestyle'],
    required: true
  },
  joiningFee: {
    type: Number,
    default: 0
  },
  annualFee: {
    type: Number,
    default: 0
  },
  rewardType: {
    type: String,
    enum: ['cashback', 'points', 'miles'],
    required: true
  },
  rewardRate: {
    type: Number,
    required: true
  },
  eligibility: {
    minIncome: {
      type: Number,
      required: true
    },
    minCreditScore: {
      type: Number,
      default: 650
    },
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 70 }
    }
  },
  benefits: [{
    type: String
  }],
  spendingCategories: [{
    category: {
      type: String,
      enum: ['fuel', 'travel', 'dining', 'groceries', 'shopping', 'entertainment', 'online', 'all']
    },
    rewardMultiplier: {
      type: Number,
      default: 1
    },
    cashbackRate: {
      type: Number,
      default: 0
    }
  }],
  specialPerks: [{
    type: String
  }],
  imageUrl: {
    type: String,
    default: ''
  },
  applyLink: {
    type: String,
    required: true
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

// Index for search optimization
cardSchema.index({ category: 1, 'eligibility.minIncome': 1 });
cardSchema.index({ issuer: 1, name: 1 });

module.exports = mongoose.model('Card', cardSchema);