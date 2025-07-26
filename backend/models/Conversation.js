const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    default: null
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: new Map()
    }
  }],
  userProfile: {
    income: { type: Number, default: null },
    age: { type: Number, default: null },
    occupation: { type: String, default: null },
    spendingCategories: {
      type: Map,
      of: Number,
      default: new Map()
    },
    preferences: {
      cardType: [String],
      maxAnnualFee: { type: Number, default: null },
      rewardPreference: [String]
    },
    creditScore: { type: Number, default: null }
  },
  recommendations: [{
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card'
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    reasoning: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  currentStep: {
    type: String,
    default: 'greeting'
  }
}, {
  timestamps: true
});

// Indexes
conversationSchema.index({ sessionId: 1 });
conversationSchema.index({ userId: 1 });
conversationSchema.index({ status: 1 });
conversationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);