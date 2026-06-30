import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Analytics.css';

function Analytics() {
  const [stats, setStats] = useState({
    total_packets: 0,
    normal_packets: 0,
    low_attacks: 0,
    mid_attacks: 0,
    severe_attacks: 0
  });
  const [chartData, setChartData] = useState([]);

  const getAuthHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }), []);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('/api/monitoring/status', getAuthHeaders());
      setStats(response.data.stats);
      
      setChartData(prev => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          low: response.data.stats.low_attacks || 0,
          mid: response.data.stats.mid_attacks || 0,
          severe: response.data.stats.severe_attacks || 0,
          normal: response.data.stats.normal_packets || 0
        }];
        return newData.slice(-30);
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const getPieData = () => [
    { name: 'Normal', value: stats.normal_packets || 0, color: '#48bb78' },
    { name: 'Low', value: stats.low_attacks || 0, color: '#FFA500' },
    { name: 'Mid', value: stats.mid_attacks || 0, color: '#FF6B6B' },
    { name: 'Severe', value: stats.severe_attacks || 0, color: '#DC143C' }
  ];

  const getBarData = () => [
    { name: 'Normal', value: stats.normal_packets || 0, fill: '#48bb78' },
    { name: 'Low', value: stats.low_attacks || 0, fill: '#FFA500' },
    { name: 'Mid', value: stats.mid_attacks || 0, fill: '#FF6B6B' },
    { name: 'Severe', value: stats.severe_attacks || 0, fill: '#DC143C' }
  ];

  const getThreatPercentage = () => {
    const total = stats.total_packets || 0;
    if (total === 0) return 0;
    const threats = (stats.low_attacks || 0) + (stats.mid_attacks || 0) + (stats.severe_attacks || 0);
    return ((threats / total) * 100).toFixed(2);
  };

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h2>📈 Analytics Dashboard</h2>
        <p>Comprehensive network security analytics</p>
      </div>

      <div className="analytics-summary">
        <div className="summary-card">
          <h3>Total Packets</h3>
          <p className="summary-value">{stats.total_packets?.toLocaleString() || 0}</p>
        </div>
        <div className="summary-card">
          <h3>Threat Rate</h3>
          <p className="summary-value threat">{getThreatPercentage()}%</p>
        </div>
        <div className="summary-card">
          <h3>Total Threats</h3>
          <p className="summary-value">
            {((stats.low_attacks || 0) + (stats.mid_attacks || 0) + (stats.severe_attacks || 0)).toLocaleString()}
          </p>
        </div>
        <div className="summary-card">
          <h3>Normal Traffic</h3>
          <p className="summary-value normal">{stats.normal_packets?.toLocaleString() || 0}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>📊 Traffic Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={getPieData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
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

        <div className="chart-card">
          <h3>📊 Threat Comparison</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={getBarData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="name" stroke="#a0aec0" />
              <YAxis stroke="#a0aec0" />
              <Tooltip contentStyle={{ background: '#1a1f3a', border: '1px solid #4a5568' }} />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card full-width">
          <h3>📈 Real-Time Traffic Trend</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="time" stroke="#a0aec0" />
              <YAxis stroke="#a0aec0" />
              <Tooltip contentStyle={{ background: '#1a1f3a', border: '1px solid #4a5568' }} />
              <Legend />
              <Line type="monotone" dataKey="normal" stroke="#48bb78" strokeWidth={2} name="Normal" />
              <Line type="monotone" dataKey="low" stroke="#FFA500" strokeWidth={2} name="Low" />
              <Line type="monotone" dataKey="mid" stroke="#FF6B6B" strokeWidth={2} name="Mid" />
              <Line type="monotone" dataKey="severe" stroke="#DC143C" strokeWidth={2} name="Severe" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
