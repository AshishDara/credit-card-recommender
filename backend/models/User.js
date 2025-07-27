const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phone: { type: String, trim: true },
    dateOfBirth: { type: Date },
    income: { type: Number, min: 0 },
    occupation: { type: String, trim: true },
    city: { type: String, trim: true },
    creditScore: { type: Number, min: 300, max: 900 }
  },
  preferences: {
    cardTypes: [String],
    spendingCategories: {
      type: Map,
      of: Number,
      default: new Map()
    },
    maxAnnualFee: { type: Number, default: null },
    rewardPreferences: [String]
  },
  conversations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  }],
  favoriteCards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ 'profile.income': 1 });
userSchema.index({ 'profile.creditScore': 1 });

module.exports = mongoose.model('User', userSchema);