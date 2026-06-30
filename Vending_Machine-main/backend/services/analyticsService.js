const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');

class AnalyticsService {
  // Get revenue trends by period
  async getRevenueTrends(period = 'daily', days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const transactions = await Transaction.find({
      transactionDate: { $gte: startDate },
      status: 'Completed'
    }).sort({ transactionDate: 1 });

    const trends = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.transactionDate);
      let key;
      
      if (period === 'daily') {
        key = date.toISOString().split('T')[0];
      } else if (period === 'weekly') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else if (period === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!trends[key]) {
        trends[key] = { date: key, revenue: 0, transactions: 0 };
      }
      trends[key].revenue += transaction.totalAmount;
      trends[key].transactions += 1;
    });

    return Object.values(trends);
  }

  // Get top selling products
  async getProductPerformance(limit = 10) {
    const result = await Transaction.aggregate([
      { $match: { status: 'Completed' } },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.product',
          name: { $first: '$products.name' },
          totalSold: { $sum: '$products.quantity' },
          revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: limit }
    ]);

    const total = result.reduce((sum, item) => sum + item.revenue, 0);
    
    return result.map(item => ({
      ...item,
      percentage: ((item.revenue / total) * 100).toFixed(1)
    }));
  }

  // Get category distribution
  async getCategoryDistribution() {
    const products = await Product.find();
    const transactions = await Transaction.find({ status: 'Completed' });

    const categoryStats = {};

    transactions.forEach(transaction => {
      transaction.products.forEach(item => {
        const product = products.find(p => p._id.toString() === item.product.toString());
        if (product) {
          if (!categoryStats[product.category]) {
            categoryStats[product.category] = { category: product.category, count: 0, revenue: 0 };
          }
          categoryStats[product.category].count += item.quantity;
          categoryStats[product.category].revenue += item.price * item.quantity;
        }
      });
    });

    const total = Object.values(categoryStats).reduce((sum, cat) => sum + cat.revenue, 0);
    
    return Object.values(categoryStats).map(cat => ({
      ...cat,
      percentage: ((cat.revenue / total) * 100).toFixed(1)
    }));
  }

  // Get peak hours analysis
  async getPeakHours() {
    const transactions = await Transaction.find({ status: 'Completed' });
    
    const hourlyStats = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      transactions: 0,
      revenue: 0
    }));

    transactions.forEach(transaction => {
      const hour = new Date(transaction.transactionDate).getHours();
      hourlyStats[hour].transactions += 1;
      hourlyStats[hour].revenue += transaction.totalAmount;
    });

    return hourlyStats;
  }

  // Compare revenue periods
  async compareRevenue() {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentRevenue = await Transaction.aggregate([
      { $match: { transactionDate: { $gte: currentMonthStart }, status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
    ]);

    const previousRevenue = await Transaction.aggregate([
      { $match: { transactionDate: { $gte: previousMonthStart, $lte: previousMonthEnd }, status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
    ]);

    const current = currentRevenue[0] || { total: 0, count: 0 };
    const previous = previousRevenue[0] || { total: 0, count: 0 };

    const change = current.total - previous.total;
    const percentageChange = previous.total > 0 ? ((change / previous.total) * 100).toFixed(1) : 0;

    return {
      current: current.total,
      previous: previous.total,
      change,
      percentageChange,
      currentCount: current.count,
      previousCount: previous.count
    };
  }

  // Get low stock products
  async getLowStockProducts(threshold = 3) {
    return await Product.find({
      quantity: { $lte: threshold },
      isAvailable: true
    }).sort({ quantity: 1 });
  }

  // Get user statistics
  async getUserStats() {
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: monthStart }
    });

    const activeUsers = await Transaction.distinct('user', {
      transactionDate: { $gte: monthStart },
      status: 'Completed'
    });

    return {
      totalUsers,
      activeUsers: activeUsers.length,
      newUsersThisMonth
    };
  }

  // Get all users with transaction stats
  async getAllUsersWithStats() {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const transactions = await Transaction.find({ user: user._id, status: 'Completed' });
      const totalSpent = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
      
      return {
        ...user.toObject(),
        totalOrders: transactions.length,
        totalSpent,
        lastOrder: transactions.length > 0 ? transactions[transactions.length - 1].transactionDate : null
      };
    }));

    return usersWithStats;
  }
}

module.exports = new AnalyticsService();
