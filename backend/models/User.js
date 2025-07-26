const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  preferences: {
    monthlyIncome: Number,
    spendingHabits: {
      fuel: Number,
      travel: Number,
      groceries: Number,
      dining: Number,
      shopping: Number,
      entertainment: Number,
      online: Number
    },
    preferredBenefits: [String],
    existingCards: [String],
    creditScore: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor', 'unknown']
    },
    primarySpendingCategory: String
  },
  conversationHistory: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  recommendations: [{
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card'
    },
    score: Number,
    reasons: [String],
    generatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// TTL index to automatically delete user sessions after 24 hours
userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('User', userSchema);