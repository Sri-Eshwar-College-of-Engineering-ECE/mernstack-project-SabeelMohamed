import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './Layout.css';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    checkMonitoringStatus();
    
    const interval = setInterval(checkMonitoringStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkMonitoringStatus = async () => {
    try {
      const response = await axios.get('/api/monitoring/status', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMonitoring(response.data.monitoring);
    } catch (error) {
      console.error('Failed to check status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-logo">
            <span className="logo-icon">🛡️</span>
            IntrusionX
          </h1>
          <div className={`monitoring-status ${monitoring ? 'active' : ''}`}>
            <span className="status-dot"></span>
            {monitoring ? 'Monitoring' : 'Inactive'}
          </div>
        </div>

        <div className="sidebar-menu">
          <Link to="/dashboard" className={`menu-item ${isActive('/dashboard') ? 'active' : ''}`}>
            <span className="menu-icon">📊</span>
            Dashboard
          </Link>
          <Link to="/alerts" className={`menu-item ${isActive('/alerts') ? 'active' : ''}`}>
            <span className="menu-icon">🚨</span>
            Alerts
          </Link>
          <Link to="/detections" className={`menu-item ${isActive('/detections') ? 'active' : ''}`}>
            <span className="menu-icon">🔍</span>
            Detections
          </Link>
          <Link to="/history" className={`menu-item ${isActive('/history') ? 'active' : ''}`}>
            <span className="menu-icon">📜</span>
            History
          </Link>
          <Link to="/analytics" className={`menu-item ${isActive('/analytics') ? 'active' : ''}`}>
            <span className="menu-icon">📈</span>
            Analytics
          </Link>
          <Link to="/reports" className={`menu-item ${isActive('/reports') ? 'active' : ''}`}>
            <span className="menu-icon">📄</span>
            Reports
          </Link>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <div className="user-email">{user?.email}</div>
              <div className="user-phone">{user?.phoneNumber}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
