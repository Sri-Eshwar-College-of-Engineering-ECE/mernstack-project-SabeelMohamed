import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">
          <span className="logo-icon">🛡️</span>
          IntrusionX
        </h1>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">📊</span>
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/detections" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">🔍</span>
          <span>Live Detections</span>
        </NavLink>
        
        <NavLink to="/alerts" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">🚨</span>
          <span>Alerts</span>
        </NavLink>
        
        <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">📈</span>
          <span>Analytics</span>
        </NavLink>
        
        <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">📜</span>
          <span>History</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
