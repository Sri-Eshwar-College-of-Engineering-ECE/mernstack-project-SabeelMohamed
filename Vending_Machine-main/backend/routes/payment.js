const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const notificationService = require('../services/notificationService');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET'
});

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, cart } = req.body;

    if (!amount || !cart || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount and cart items are required'
      });
    }

    // Validate products and stock
    for (const item of cart) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create pending transaction in database
    const transactionProducts = [];
    for (const item of cart) {
      const product = await Product.findById(item.product);
      transactionProducts.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price
      });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      products: transactionProducts,
      totalAmount: amount,
      paymentMethod: 'Card',
      status: 'Pending'
    });

    res.status(200).json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: transaction._id
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update transaction status
    const transaction = await Transaction.findById(orderId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    transaction.status = 'Completed';
    await transaction.save();

    // Update product quantities and check for low stock
    const lowStockProducts = [];
    for (const item of transaction.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity -= item.quantity;
        product.isAvailable = product.quantity > 0;
        await product.save();

        // Check if product stock is 3 or below
        if (product.quantity <= 3 && product.quantity > 0) {
          lowStockProducts.push(product);
          
          // Send SMS alert immediately (with cooldown)
          const adminPhone = process.env.ADMIN_PHONE;
          if (adminPhone) {
            const smsResult = await notificationService.sendLowStockSMS(
              adminPhone,
              product.name,
              product.quantity,
              product._id.toString()
            );
            if (smsResult.success) {
              console.log(`🚨 Low stock SMS sent for ${product.name} (${product.quantity} left)`);
            } else if (smsResult.cooldownActive) {
              console.log(`⏳ SMS cooldown active for ${product.name} (${smsResult.remainingMinutes} min remaining)`);
            }
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: transaction,
      lowStockAlert: lowStockProducts.length > 0 ? `${lowStockProducts.length} product(s) reached low stock` : null
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
