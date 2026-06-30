import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, AlertTriangle, Bell } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AnalyticsDashboard = () => {
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    revenueTrends: [],
    productPerformance: [],
    categoryDistribution: [],
    peakHours: [],
    comparison: null,
    lowStock: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const baseUrl = 'https://vending-machine-r93c.onrender.com/api/analytics';

    try {
      const [trends, performance, categories, hours, comparison, lowStock] = await Promise.all([
        fetch(`${baseUrl}/revenue-trends?period=${period}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),
        fetch(`${baseUrl}/product-performance`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),
        fetch(`${baseUrl}/category-distribution`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),
        fetch(`${baseUrl}/peak-hours`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),
        fetch(`${baseUrl}/comparison`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),
        fetch(`${baseUrl}/low-stock`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json())
      ]);

      setAnalytics({
        revenueTrends: trends.data || [],
        productPerformance: performance.data || [],
        categoryDistribution: categories.data || [],
        peakHours: hours.data || [],
        comparison: comparison.data || null,
        lowStock: lowStock.data || []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendLowStockNotification = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://vending-machine-r93c.onrender.com/api/analytics/notify-low-stock', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ threshold: 3 })
      });
      const data = await response.json();
      alert(data.success ? 'Notifications sent successfully!' : 'Failed to send notifications');
    } catch (error) {
      console.error('Error sending notifications:', error);
      alert('Error sending notifications');
    }
  };

  const getHeatmapColor = (transactions) => {
    const maxTrans = Math.max(...analytics.peakHours.map(h => h.transactions));
    const intensity = (transactions / maxTrans) * 100;
    if (intensity > 75) return '#ef4444';
    if (intensity > 50) return '#f59e0b';
    if (intensity > 25) return '#3b82f6';
    return '#e2e8f0';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold opacity-90">This Month Revenue</h3>
            <DollarSign className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold mb-2">₹{analytics.comparison?.current || 0}</p>
          <div className="flex items-center gap-2">
            {analytics.comparison?.percentageChange >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-semibold">
              {analytics.comparison?.percentageChange}% vs last month
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold opacity-90">Total Transactions</h3>
            <ShoppingCart className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold mb-2">{analytics.comparison?.currentCount || 0}</p>
          <p className="text-sm opacity-90">This month</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold opacity-90">Low Stock Items</h3>
            <Package className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold mb-2">{analytics.lowStock.length}</p>
          <button
            onClick={sendLowStockNotification}
            className="flex items-center gap-2 text-sm font-semibold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
            Send Alert
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {['daily', 'weekly', 'monthly'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              period === p
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Revenue Trends Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Revenue Trends</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={analytics.revenueTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
            <Line type="monotone" dataKey="transactions" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Product Performance & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.productPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.categoryDistribution}
                dataKey="revenue"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percentage }) => `${name} ${percentage}%`}
              >
                {analytics.categoryDistribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Peak Hours Heatmap */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Peak Transaction Hours</h3>
        <div className="grid grid-cols-12 gap-3">
          {analytics.peakHours.map((hourData) => (
            <div
              key={hourData.hour}
              className="aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all hover:scale-110 cursor-pointer shadow-md"
              style={{
                backgroundColor: getHeatmapColor(hourData.transactions),
                color: hourData.transactions > 5 ? 'white' : '#1e293b'
              }}
              title={`${hourData.hour}:00 - ${hourData.transactions} transactions - ₹${hourData.revenue}`}
            >
              <span>{hourData.hour}h</span>
              <span className="text-[10px] mt-1">{hourData.transactions}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {analytics.lowStock.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="text-orange-500" />
              Low Stock Alerts
            </h3>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
              {analytics.lowStock.length} items
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.lowStock.map((product) => (
              <div key={product._id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                <div>
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="text-sm text-slate-600">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">{product.quantity}</p>
                  <p className="text-xs text-slate-500">left</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
