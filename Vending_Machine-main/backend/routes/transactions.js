const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/transactions
// @desc    Get all transactions (Admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name email')
      .populate('products.product', 'name')
      .sort({ transactionDate: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/transactions/user
// @desc    Get user's transactions
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .populate('products.product', 'name')
      .sort({ transactionDate: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/transactions
// @desc    Create new transaction
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { products, paymentMethod } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add products to the transaction'
      });
    }

    let totalAmount = 0;
    const transactionProducts = [];

    // Validate products and calculate total
    for (const item of products) {
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
          message: `Insufficient quantity for ${product.name}`
        });
      }

      // Update product quantity
      product.quantity -= item.quantity;
      product.isAvailable = product.quantity > 0;
      await product.save();

      totalAmount += product.price * item.quantity;
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
      totalAmount,
      paymentMethod: paymentMethod || 'Card',
      status: 'Completed'
    });

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/transactions/stats
// @desc    Get transaction statistics (Admin only)
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayTransactions = await Transaction.countDocuments({
      transactionDate: { $gte: todayStart }
    });

    const todayRevenue = await Transaction.aggregate([
      { 
        $match: { 
          status: 'Completed',
          transactionDate: { $gte: todayStart }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTransactions,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayTransactions,
        todayRevenue: todayRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
