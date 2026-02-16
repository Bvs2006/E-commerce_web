const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discount: {
    type: Number,
    required: [true, 'Please provide discount percentage'],
    min: 0,
    max: 100
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please provide expiry date']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  usageLimit: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  const isNotExpired = this.expiryDate > now;
  const hasUsageLeft = !this.usageLimit || this.usedBy.length < this.usageLimit;
  return this.isActive && isNotExpired && hasUsageLeft;
};

module.exports = mongoose.model('Coupon', couponSchema);
