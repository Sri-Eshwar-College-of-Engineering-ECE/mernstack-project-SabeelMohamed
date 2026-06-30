const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const auth = require('../middleware/auth');

function validateCollector(req, res, next) {
  const configuredKey = process.env.COLLECTOR_API_KEY;

  if (!configuredKey) {
    return next();
  }

  const incomingKey = req.headers['x-api-key'] || req.headers['x-collector-key'];
  if (incomingKey !== configuredKey) {
    return res.status(401).json({ message: 'Invalid collector key' });
  }

  return next();
}

router.post('/', validateCollector, async (req, res) => {
  try {
    const payload = req.body || {};

    if (typeof payload.prediction !== 'number') {
      return res.status(400).json({ message: 'prediction must be a number' });
    }

    const document = await Prediction.create({
      source: payload.source || 'collector',
      features: Array.isArray(payload.features) ? payload.features : [],
      prediction: payload.prediction,
      predictionLabel: payload.predictionLabel || payload.prediction_label || 'Unknown',
      confidence: typeof payload.confidence === 'number' ? payload.confidence : 0,
      metadata: payload.metadata || {}
    });

    if (global.io) {
      global.io.emit('prediction:new', document);
    }

    res.status(201).json({ success: true, id: document._id });
  } catch (error) {
    console.error('Create prediction error:', error.message);
    res.status(500).json({ message: 'Failed to save prediction', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '100', 10), 500);
    const items = await Prediction.find().sort({ timestamp: -1 }).limit(limit);
    res.json(items);
  } catch (error) {
    console.error('List predictions error:', error.message);
    res.status(500).json({ message: 'Failed to fetch predictions', error: error.message });
  }
});

router.get('/summary', auth, async (req, res) => {
  try {
    const total = await Prediction.countDocuments();
    const buckets = await Prediction.aggregate([
      {
        $group: {
          _id: '$prediction',
          count: { $sum: 1 }
        }
      }
    ]);

    const summary = {
      total,
      normal: 0,
      low: 0,
      mid: 0,
      severe: 0
    };

    buckets.forEach((item) => {
      if (item._id === 0) summary.normal = item.count;
      if (item._id === 1) summary.low = item.count;
      if (item._id === 2) summary.mid = item.count;
      if (item._id === 3) summary.severe = item.count;
    });

    res.json(summary);
  } catch (error) {
    console.error('Prediction summary error:', error.message);
    res.status(500).json({ message: 'Failed to fetch summary', error: error.message });
  }
});

module.exports = router;