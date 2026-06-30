import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Alerts.css';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [user, setUser] = useState(null);

  const getAuthHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }), []);

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await axios.get('/api/alerts?limit=100', getAuthHeaders());
      setAlerts(response.data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const getSeverityColor = (severity) => {
    const colors = {
      low: '#FFA500',
      mid: '#FF6B6B',
      severe: '#DC143C'
    };
    return colors[severity] || '#4299e1';
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.severity === filter);

  return (
    <div className="alerts-page">
      <div className="page-header">
        <div>
          <h2>🚨 Security Alerts</h2>
          <p>Monitor and manage security threats</p>
        </div>
      </div>

      <div className="alert-info-cards">
        <div className="info-card low">
          <div className="info-icon">⚠️</div>
          <div className="info-content">
            <h4>Low Severity</h4>
            <p>Dashboard notification only</p>
          </div>
        </div>
        <div className="info-card mid">
          <div className="info-icon">📧</div>
          <div className="info-content">
            <h4>Mid Severity</h4>
            <p>Email: {user?.email}</p>
          </div>
        </div>
        <div className="info-card severe">
          <div className="info-icon">📱</div>
          <div className="info-content">
            <h4>Severe</h4>
            <p>SMS + signature block enforcement</p>
          </div>
        </div>
      </div>

      <div className="alerts-controls">
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All ({alerts.length})
          </button>
          <button 
            className={filter === 'low' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('low')}
          >
            Low ({alerts.filter(a => a.severity === 'low').length})
          </button>
          <button 
            className={filter === 'mid' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('mid')}
          >
            Mid ({alerts.filter(a => a.severity === 'mid').length})
          </button>
          <button 
            className={filter === 'severe' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('severe')}
          >
            Severe ({alerts.filter(a => a.severity === 'severe').length})
          </button>
        </div>
      </div>

      <div className="alerts-list">
        {filteredAlerts.length === 0 ? (
          <div className="no-data-card">
            <span className="no-data-icon">🔔</span>
            <h3>No Alerts</h3>
            <p>No security alerts found for the selected filter</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert._id} className="alert-card">
              <div className="alert-card-header">
                <span 
                  className="alert-severity-badge" 
                  style={{ 
                    backgroundColor: `${getSeverityColor(alert.severity)}20`,
                    color: getSeverityColor(alert.severity)
                  }}
                >
                  {alert.severity.toUpperCase()}
                </span>
                <span className="alert-time">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="alert-card-body">
                <div className="alert-detail">
                  <span className="detail-label">Attack Type:</span>
                  <span className="detail-value">Type {alert.attackType}</span>
                </div>
                <div className="alert-detail">
                  <span className="detail-label">Confidence:</span>
                  <span className="detail-value">{(alert.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="alert-detail">
                  <span className="detail-label">Port:</span>
                  <span className="detail-value">{alert.port}</span>
                </div>
                <div className="alert-detail">
                  <span className="detail-label">Protocol:</span>
                  <span className="detail-value">{alert.protocol}</span>
                </div>
                <div className="alert-detail">
                  <span className="detail-label">Packet Size:</span>
                  <span className="detail-value">{alert.packetSize} bytes</span>
                </div>
                {alert.blocked && (
                  <div className="notification-badge">
                    🛡 Blocked by prevention layer
                  </div>
                )}
                {alert.notificationSent && (
                  <div className="notification-badge">
                    ✓ Notification Sent
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Alerts;
