const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const Alert = require('../models/Alert');
const NetworkStats = require('../models/NetworkStats');

const isProduction = process.env.NODE_ENV === 'production';
const configuredMlService = process.env.ML_SERVICE_URL;
const ML_SERVICE = isProduction
  ? (configuredMlService && !configuredMlService.includes('localhost')
      ? configuredMlService
      : 'https://intrusionx-ml.onrender.com')
  : (configuredMlService || 'http://localhost:5001');

const monitoringState = {
  monitoring: false,
  startTime: null,
  lastError: null,
};

function buildFallbackStatus() {
  const uptime = monitoringState.startTime ? Math.max(0, Math.floor((Date.now() - monitoringState.startTime) / 1000)) : 0;

  return {
    monitoring: monitoringState.monitoring,
    stats: {
      total_packets: 0,
      normal_packets: 0,
      low_attacks: 0,
      mid_attacks: 0,
      severe_attacks: 0,
      blocked_packets: 0,
      monitoring: monitoringState.monitoring,
      start_time: monitoringState.startTime,
    },
    uptime,
    recent_detections: [],
    source: 'backend-fallback',
    last_error: monitoringState.lastError,
  };
}

router.post('/start', auth, async (req, res) => {
  try {
    const blockedAlerts = await Alert.find({ userId: req.userId, blocked: true })
      .sort({ timestamp: -1 })
      .limit(100)
      .select('signature attackType protocol port');

    const blockedSignatures = [...new Set(blockedAlerts.map(alert => alert.signature).filter(Boolean))];

    const response = await axios.post(`${ML_SERVICE}/api/ml/start`, {
      userId: req.userId,
      blockedSignatures
    });

    monitoringState.monitoring = true;
    monitoringState.startTime = monitoringState.startTime || Date.now();
    monitoringState.lastError = null;

    res.json(response.data);
  } catch (error) {
    console.error('Start monitoring error:', error.message);
    monitoringState.monitoring = true;
    monitoringState.startTime = monitoringState.startTime || Date.now();
    monitoringState.lastError = error.message;

    res.json({
      message: 'Monitoring started',
      status: 'running',
      warning: 'ML service unavailable, using backend fallback status',
      error: error.message,
    });
  }
});

router.post('/stop', auth, async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE}/api/ml/stop`);

    monitoringState.monitoring = false;
    monitoringState.lastError = null;

    res.json(response.data);
  } catch (error) {
    console.error('Stop monitoring error:', error.message);
    monitoringState.monitoring = false;
    monitoringState.lastError = error.message;

    res.json({
      message: 'Monitoring stopped',
      status: 'stopped',
      warning: 'ML service unavailable, using backend fallback status',
      error: error.message,
    });
  }
});

router.get('/status', auth, async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE}/api/ml/status`);
    monitoringState.monitoring = Boolean(response.data?.monitoring);
    monitoringState.startTime = response.data?.stats?.start_time || monitoringState.startTime;
    monitoringState.lastError = null;
    res.json(response.data);
  } catch (error) {
    console.error('Get status error:', error.message);
    monitoringState.lastError = error.message;
    res.json(buildFallbackStatus());
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE}/api/ml/stats`);
    
    const stats = new NetworkStats({
      userId: req.userId,
      totalPackets: response.data.network_stats.total_packets,
      normalPackets: response.data.network_stats.normal_packets,
      lowAttacks: response.data.network_stats.low_attacks,
      midAttacks: response.data.network_stats.mid_attacks,
      severeAttacks: response.data.network_stats.severe_attacks,
      blockedPackets: response.data.network_stats.blocked_packets || 0
    });
    
    await stats.save().catch(() => null);
    
    res.json(response.data);
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.json({
      network_stats: {
        total_packets: 0,
        normal_packets: 0,
        low_attacks: 0,
        mid_attacks: 0,
        severe_attacks: 0,
        blocked_packets: 0,
        monitoring: monitoringState.monitoring,
        start_time: monitoringState.startTime,
      },
      system_stats: {},
      recent_detections: [],
      warning: 'ML service unavailable, using backend fallback stats',
      error: error.message,
    });
  }
});

router.get('/blocklist', auth, async (req, res) => {
  try {
    const blockedAlerts = await Alert.find({ userId: req.userId, blocked: true })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(blockedAlerts.map(alert => ({
      signature: alert.signature,
      attackType: alert.attackType,
      port: alert.port,
      protocol: alert.protocol,
      timestamp: alert.timestamp,
      mitigationAction: alert.mitigationAction
    })));
  } catch (error) {
    console.error('Get blocklist error:', error.message);
    res.status(500).json({
      message: 'Failed to get blocklist',
      error: error.message
    });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const history = await NetworkStats.find({ userId: req.userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    
    res.json(history);
  } catch (error) {
    console.error('Get history error:', error.message);
    res.status(500).json({ 
      message: 'Failed to get history', 
      error: error.message 
    });
  }
});

module.exports = router;
