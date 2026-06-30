const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  source: {
    type: String,
    default: 'collector'
  },
  features: {
    type: [Number],
    default: []
  },
  prediction: {
    type: Number,
    required: true
  },
  predictionLabel: {
    type: String,
    default: 'Normal'
  },
  confidence: {
    type: Number,
    default: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

predictionSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);