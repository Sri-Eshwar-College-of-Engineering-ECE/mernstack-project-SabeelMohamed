const mongoose = require('mongoose');

const networkStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalPackets: {
    type: Number,
    default: 0
  },
  normalPackets: {
    type: Number,
    default: 0
  },
  lowAttacks: {
    type: Number,
    default: 0
  },
  midAttacks: {
    type: Number,
    default: 0
  },
  severeAttacks: {
    type: Number,
    default: 0
  },
  blockedPackets: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

networkStatsSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('NetworkStats', networkStatsSchema);
