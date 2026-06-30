const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const analyticsService = require('../services/analyticsService');
const notificationService = require('../services/notificationService');

// All routes are protected and admin-only
router.use(protect, authorize('admin'));

// @route   GET /api/analytics/revenue-trends
// @desc    Get revenue trends
// @access  Private/Admin
router.get('/revenue-trends', async (req, res) => {
  try {
    const { period = 'daily', days = 30 } = req.query;
    const data = await analyticsService.getRevenueTrends(period, parseInt(days));
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching revenue trends:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue trends',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/product-performance
// @desc    Get top selling products
// @access  Private/Admin
router.get('/product-performance', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const data = await analyticsService.getProductPerformance(parseInt(limit));
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching product performance:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product performance',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/category-distribution
// @desc    Get sales by category
// @access  Private/Admin
router.get('/category-distribution', async (req, res) => {
  try {
    const data = await analyticsService.getCategoryDistribution();
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching category distribution:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category distribution',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/peak-hours
// @desc    Get peak transaction hours
// @access  Private/Admin
router.get('/peak-hours', async (req, res) => {
  try {
    const data = await analyticsService.getPeakHours();
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching peak hours:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching peak hours',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/comparison
// @desc    Compare current vs previous period
// @access  Private/Admin
router.get('/comparison', async (req, res) => {
  try {
    const data = await analyticsService.compareRevenue();
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching comparison:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comparison',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/low-stock
// @desc    Get low stock products
// @access  Private/Admin
router.get('/low-stock', async (req, res) => {
  try {
    const { threshold = 3 } = req.query;
    const data = await analyticsService.getLowStockProducts(parseInt(threshold));
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching low stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching low stock',
      error: error.message
    });
  }
});

// @route   POST /api/analytics/notify-low-stock
// @desc    Send SMS/Email notifications for low stock
// @access  Private/Admin
router.post('/notify-low-stock', async (req, res) => {
  try {
    const { threshold = 3 } = req.body;
    const result = await notificationService.checkAndNotifyLowStock(threshold);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending notifications',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/user-stats
// @desc    Get user statistics
// @access  Private/Admin
router.get('/user-stats', async (req, res) => {
  try {
    const data = await analyticsService.getUserStats();
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user stats',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/users
// @desc    Get all users with transaction stats
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const data = await analyticsService.getAllUsersWithStats();
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

module.exports = router;
