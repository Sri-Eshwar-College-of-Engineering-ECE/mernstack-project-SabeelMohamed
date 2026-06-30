const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendEmailAlert, sendSMSAlert } = require('../utils/notifications');

const getSignature = (detection) => `${detection.attack_type || 0}:${detection.protocol || 0}:${detection.port || 0}`;

router.post('/create', async (req, res) => {
  try {
    const { severity, detection, userId } = req.body;
    const signature = getSignature(detection);
    const shouldBlock = severity === 'severe';
    
    const alert = new Alert({
      userId: userId || null,
      severity,
      attackType: detection.attack_type,
      confidence: detection.confidence,
      signature,
      mitigationAction: shouldBlock ? 'signature_block' : severity === 'mid' ? 'email_alert' : 'dashboard_notify',
      blocked: shouldBlock,
      blockedAt: shouldBlock ? new Date() : undefined,
      packetSize: detection.packet_size,
      protocol: detection.protocol,
      port: detection.port
    });
    
    await alert.save();
    
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        console.log(`User found: ${user.email}, Phone: ${user.phoneNumber}`);
        
        if (severity === 'mid') {
          const emailSent = await sendEmailAlert(user.email, severity, detection);
          console.log(`Email alert sent: ${emailSent}`);
        } else if (severity === 'severe') {
          if (user.phoneNumber) {
            const smsSent = await sendSMSAlert(user.phoneNumber, severity, detection);
            console.log(`SMS alert sent: ${smsSent}`);
          } else {
            console.log('No phone number available for SMS alert');
          }
        }
        alert.notificationSent = true;
        await alert.save();
      } else {
        console.log('User not found for userId:', userId);
      }
    }
    
    res.status(201).json({
      ...alert.toObject(),
      mitigation: {
        blocked: alert.blocked,
        action: alert.mitigationAction,
        signature: alert.signature
      }
    });
  } catch (error) {
    console.error('Alert creation error:', error);
    res.status(500).json({ message: 'Failed to create alert', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { limit = 100, severity } = req.query;
    
    const query = { userId: req.userId };
    if (severity) {
      query.severity = severity;
    }
    
    const alerts = await Alert.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    
    res.json(alerts);
  } catch (error) {
    console.error('Fetch alerts error:', error);
    res.status(500).json({ message: 'Failed to fetch alerts', error: error.message });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Alert.aggregate([
      { $match: { userId: req.userId } },
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const result = {
      low: 0,
      mid: 0,
      severe: 0,
      total: 0
    };
    
    stats.forEach(stat => {
      result[stat._id] = stat.count;
      result.total += stat.count;
    });
    
    res.json(result);
  } catch (error) {
    console.error('Fetch stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

module.exports = router;
