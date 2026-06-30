import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DashboardHome.css';

function DashboardHome() {
  const [monitoring, setMonitoring] = useState(false);
  const [stats, setStats] = useState({
    total_packets: 0,
    normal_packets: 0,
    low_attacks: 0,
    mid_attacks: 0,
    severe_attacks: 0,
    blocked_packets: 0
  });
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);

  const getAuthHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }), []);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await axios.get('/api/monitoring/status', getAuthHeaders());
      setMonitoring(response.data.monitoring);
      setStats(response.data.stats);
      
      setChartData(prev => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          threats: (response.data.stats.low_attacks || 0) + 
                   (response.data.stats.mid_attacks || 0) + 
                   (response.data.stats.severe_attacks || 0),
          normal: response.data.stats.normal_packets || 0
        }];
        return newData.slice(-20);
      });
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const startMonitoring = async () => {
    setLoading(true);
    try {
      await axios.post('/api/monitoring/start', {}, getAuthHeaders());
      setMonitoring(true);
    } catch (error) {
      alert('Failed to start monitoring: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const stopMonitoring = async () => {
    setLoading(true);
    try {
      await axios.post('/api/monitoring/stop', {}, getAuthHeaders());
      setMonitoring(false);
    } catch (error) {
      alert('Failed to stop monitoring');
    } finally {
      setLoading(false);
    }
  };

  const getPieData = () => [
    { name: 'Normal', value: stats.normal_packets || 0, color: '#48bb78' },
    { name: 'Low', value: stats.low_attacks || 0, color: '#FFA500' },
    { name: 'Mid', value: stats.mid_attacks || 0, color: '#FF6B6B' },
    { name: 'Severe', value: stats.severe_attacks || 0, color: '#DC143C' }
  ];

  const getThreatPercentage = () => {
    const total = stats.total_packets || 0;
    if (total === 0) return 0;
    const threats = (stats.low_attacks || 0) + (stats.mid_attacks || 0) + (stats.severe_attacks || 0);
    return ((threats / total) * 100).toFixed(2);
  };

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h2>Overview</h2>
        <div className="monitoring-control">
          {!monitoring ? (
            <button className="btn-start" onClick={startMonitoring} disabled={loading}>
              {loading ? 'Starting...' : '▶ Start Monitoring'}
            </button>
          ) : (
            <button className="btn-stop" onClick={stopMonitoring} disabled={loading}>
              {loading ? 'Stopping...' : '⏸ Stop Monitoring'}
            </button>
          )}
          <div className={`status-indicator ${monitoring ? 'active' : ''}`}>
            <span className="status-dot"></span>
            {monitoring ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Packets</h3>
            <p className="stat-value">{stats.total_packets?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="stat-card normal">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Normal Traffic</h3>
            <p className="stat-value">{stats.normal_packets?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="stat-card low">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Low Threats</h3>
            <p className="stat-value">{stats.low_attacks?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="stat-card mid">
          <div className="stat-icon">🔶</div>
          <div className="stat-content">
            <h3>Mid Threats</h3>
            <p className="stat-value">{stats.mid_attacks?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="stat-card severe">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <h3>Severe Threats</h3>
            <p className="stat-value">{stats.severe_attacks?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛡️</div>
          <div className="stat-content">
            <h3>Blocked Attempts</h3>
            <p className="stat-value">{stats.blocked_packets?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="stat-card threat-percentage">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Threat Rate</h3>
            <p className="stat-value">{getThreatPercentage()}%</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="panel chart-panel">
          <h3>📈 Traffic Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="time" stroke="#a0aec0" />
              <YAxis stroke="#a0aec0" />
              <Tooltip contentStyle={{ background: '#1a1f3a', border: '1px solid #4a5568' }} />
              <Legend />
              <Line type="monotone" dataKey="threats" stroke="#DC143C" strokeWidth={2} name="Threats" />
              <Line type="monotone" dataKey="normal" stroke="#48bb78" strokeWidth={2} name="Normal" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel chart-panel">
          <h3>🥧 Traffic Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getPieData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {getPieData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
