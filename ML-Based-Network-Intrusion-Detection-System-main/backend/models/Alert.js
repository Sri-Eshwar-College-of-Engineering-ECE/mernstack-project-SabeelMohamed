const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  severity: {
    type: String,
    enum: ['low', 'mid', 'severe'],
    required: true
  },
  attackType: {
    type: Number,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  signature: {
    type: String,
    index: true
  },
  mitigationAction: {
    type: String,
    enum: ['dashboard_notify', 'email_alert', 'sms_alert', 'signature_block'],
    default: 'dashboard_notify'
  },
  blocked: {
    type: Boolean,
    default: false
  },
  packetSize: Number,
  protocol: Number,
  port: Number,
  blockedAt: {
    type: Date
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

alertSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Alert', alertSchema);
