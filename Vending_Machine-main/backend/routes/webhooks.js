const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Transaction = require('../models/Transaction');

// @route   POST /api/webhooks/razorpay
// @desc    Handle Razorpay payment webhooks
// @access  Public (but verified)
router.post('/razorpay', async (req, res) => {
  try {
    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const signature = req.headers['x-razorpay-signature'];
    
    // Create expected signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    // Verify signature (skip in test mode if no secret set)
    if (webhookSecret && signature !== expectedSignature) {
      console.log('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log('Webhook received:', event);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;
      
      case 'payment.authorized':
        console.log('Payment authorized:', payload.payment.entity.id);
        break;
      
      default:
        console.log('Unhandled webhook event:', event);
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Handle successful payment
async function handlePaymentCaptured(payment) {
  try {
    console.log('Payment captured:', payment.id);
    console.log('Amount:', payment.amount / 100, 'INR');
    console.log('Method:', payment.method);
    console.log('UPI:', payment.vpa || 'N/A');
    
    // Find transaction by order_id or notes
    const orderId = payment.notes?.orderId;
    
    if (orderId) {
      const transaction = await Transaction.findById(orderId);
      
      if (transaction) {
        transaction.status = 'Completed';
        transaction.paymentId = payment.id;
        transaction.paymentDetails = {
          method: payment.method,
          upiId: payment.vpa,
          capturedAt: new Date(payment.created_at * 1000)
        };
        await transaction.save();
        
        console.log('Transaction updated:', orderId);
      }
    }
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
}

// Handle failed payment
async function handlePaymentFailed(payment) {
  try {
    console.log('Payment failed:', payment.id);
    console.log('Error:', payment.error_description);
    
    const orderId = payment.notes?.orderId;
    
    if (orderId) {
      const transaction = await Transaction.findById(orderId);
      
      if (transaction) {
        transaction.status = 'Failed';
        transaction.paymentId = payment.id;
        transaction.paymentError = payment.error_description;
        await transaction.save();
        
        console.log('Transaction marked as failed:', orderId);
      }
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

// @route   GET /api/webhooks/test
// @desc    Test webhook endpoint
// @access  Public
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Webhook endpoint is working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
