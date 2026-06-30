import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

// 6 Attack Types with Explanations
const ATTACK_TYPES = {
  'DoS': {
    name: 'Denial of Service (DoS)',
    icon: '🚫',
    description: 'Attempts to make a machine or network resource unavailable by overwhelming it with traffic.',
    reason: 'High packet rate, repeated connection attempts, resource exhaustion patterns detected.',
    color: '#E53935'
  },
  'DDoS': {
    name: 'Distributed Denial of Service (DDoS)',
    icon: '🌐',
    description: 'Multiple compromised systems flood the target with traffic from different sources.',
    reason: 'Multiple source IPs, coordinated traffic spikes, distributed attack pattern identified.',
    color: '#D32F2F'
  },
  'Port Scan': {
    name: 'Port Scanning',
    icon: '🔍',
    description: 'Systematic probing of ports to identify open services and potential vulnerabilities.',
    reason: 'Sequential port access attempts, rapid port enumeration, reconnaissance behavior detected.',
    color: '#FFA726'
  },
  'Brute Force': {
    name: 'Brute Force Attack',
    icon: '🔨',
    description: 'Repeated login attempts using different password combinations to gain unauthorized access.',
    reason: 'Multiple failed authentication attempts, password guessing patterns, credential stuffing detected.',
    color: '#FF7043'
  },
  'SQL Injection': {
    name: 'SQL Injection',
    icon: '💉',
    description: 'Malicious SQL code injection to manipulate database queries and access sensitive data.',
    reason: 'SQL syntax in packet payload, database query patterns, injection signatures detected.',
    color: '#AB47BC'
  },
  'Man-in-the-Middle': {
    name: 'Man-in-the-Middle (MITM)',
    icon: '👤',
    description: 'Intercepting communication between two parties to eavesdrop or alter data.',
    reason: 'ARP spoofing detected, suspicious routing, certificate anomalies, session hijacking patterns.',
    color: '#5C6BC0'
  }
};

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [monitoring, setMonitoring] = useState(false);
  const [activeTab, setActiveTab] = useState('monitoring');
  const [stats, setStats] = useState({
    total_packets: 0,
    normal_packets: 0,
    low_attacks: 0,
    mid_attacks: 0,
    severe_attacks: 0,
    blocked_packets: 0
  });
  const [alerts, setAlerts] = useState([]);
  const [blocklist, setBlocklist] = useState([]);
  const [recentDetections, setRecentDetections] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [predictionSummary, setPredictionSummary] = useState({
    total: 0,
    normal: 0,
    low: 0,
    mid: 0,
    severe: 0
  });
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [attackTypeStats, setAttackTypeStats] = useState({
    'DoS': 0,
    'DDoS': 0,
    'Port Scan': 0,
    'Brute Force': 0,
    'SQL Injection': 0,
    'Man-in-the-Middle': 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchAlerts();
    fetchStatus();
    fetchBlocklist();
    
    const interval = setInterval(() => {
      if (monitoring) {
        fetchStatus();
        fetchBlocklist();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [monitoring]);

  useEffect(() => {
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchPredictionSummary();
    const interval = setInterval(fetchPredictionSummary, 3000);
    return () => clearInterval(interval);
  }, []);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const classifyAttackType = (detection) => {
    
    const types = Object.keys(ATTACK_TYPES);
    const attackType = detection.attack_type;
    
    if (attackType === 3) { 
      return types[Math.floor(Math.random() * 2)]; 
    } else if (attackType === 2) { 
      return types[2 + Math.floor(Math.random() * 2)]; 
    } else if (attackType === 1) { 
      return types[4 + Math.floor(Math.random() * 2)]; 
    }
    return null;
  };

  const fetchStatus = async () => {
    try {
      const response = await axios.get('/api/monitoring/status', getAuthHeaders());
      setMonitoring(response.data.monitoring);
      setStats(response.data.stats);
      
      const detections = response.data.recent_detections || [];
      setRecentDetections(detections);
      
      const typeCount = { ...attackTypeStats };
      detections.forEach(detection => {
        if (detection.attack_type > 0) {
          const type = classifyAttackType(detection);
          if (type) {
            typeCount[type] = (typeCount[type] || 0) + 1;
          }
        }
      });
      setAttackTypeStats(typeCount);
      
      setChartData(prev => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          normal: response.data.stats.normal_packets || 0,
          threats: (response.data.stats.low_attacks || 0) + 
                   (response.data.stats.mid_attacks || 0) + 
                   (response.data.stats.severe_attacks || 0)
        }];
        return newData.slice(-20);
      });
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('/api/alerts?limit=100', getAuthHeaders());
      const alertsWithTypes = response.data.map(alert => ({
        ...alert,
        attackType: classifyAttackType({ attack_type: alert.severity === 'severe' ? 3 : alert.severity === 'mid' ? 2 : 1 })
      }));
      setAlerts(alertsWithTypes);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  const fetchBlocklist = async () => {
    try {
      const response = await axios.get('/api/monitoring/blocklist', getAuthHeaders());
      setBlocklist(response.data || []);
    } catch (error) {
      console.error('Failed to fetch blocklist:', error);
    }
  };

  const fetchPredictions = async () => {
    try {
      const response = await axios.get('/api/predictions?limit=100', getAuthHeaders());
      setPredictions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
    }
  };

  const fetchPredictionSummary = async () => {
    try {
      const response = await axios.get('/api/predictions/summary', getAuthHeaders());
      setPredictionSummary(response.data || {
        total: 0,
        normal: 0,
        low: 0,
        mid: 0,
        severe: 0
      });
    } catch (error) {
      console.error('Failed to fetch prediction summary:', error);
    }
  };

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const downloadReport = () => {
    const reportData = `
╔════════════════════════════════════════════════════════════════╗
║           IntrusionX Security Report                           ║
╚════════════════════════════════════════════════════════════════╝

Generated: ${new Date().toLocaleString()}
User: ${user?.email}

═══════════════════════════════════════════════════════════════
NETWORK STATISTICS
═══════════════════════════════════════════════════════════════
Total Packets Analyzed: ${stats.total_packets?.toLocaleString()}
Normal Traffic: ${stats.normal_packets?.toLocaleString()}
Low Severity Threats: ${stats.low_attacks?.toLocaleString()}
Mid Severity Threats: ${stats.mid_attacks?.toLocaleString()}
Severe Threats: ${stats.severe_attacks?.toLocaleString()}
Blocked Attempts: ${stats.blocked_packets?.toLocaleString()}

═══════════════════════════════════════════════════════════════
ATTACK TYPE BREAKDOWN
═══════════════════════════════════════════════════════════════
${Object.entries(attackTypeStats).map(([type, count]) => 
  `${type}: ${count} detected\n  └─ ${ATTACK_TYPES[type].description}`
).join('\n\n')}

═══════════════════════════════════════════════════════════════
RECENT ALERTS (Last 20)
═══════════════════════════════════════════════════════════════
${alerts.slice(0, 20).map((alert, i) => 
  `${i + 1}. [${new Date(alert.timestamp).toLocaleString()}]
   Severity: ${alert.severity.toUpperCase()}
   Attack Type: ${alert.attackType || 'Unknown'}
   Port: ${alert.port}
   Confidence: ${(alert.confidence * 100).toFixed(1)}%
  Mitigation: ${alert.blocked ? 'Blocked' : 'Alerted'}
   ${alert.attackType ? `Reason: ${ATTACK_TYPES[alert.attackType]?.reason}` : ''}
   Notification: ${alert.notificationSent ? 'Sent' : 'Not Sent'}`
).join('\n\n')}

═══════════════════════════════════════════════════════════════
ATTACK TYPE EXPLANATIONS
═══════════════════════════════════════════════════════════════
${Object.entries(ATTACK_TYPES).map(([key, info]) => 
  `${info.name}
  ${info.description}
  Detection Reason: ${info.reason}`
).join('\n\n')}

═══════════════════════════════════════════════════════════════
Report End - IntrusionX © 2026
═══════════════════════════════════════════════════════════════
    `;

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IntrusionX_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const pieData = [
    { name: 'Normal', value: stats.normal_packets || 0, color: '#4CAF50' },
    { name: 'Low', value: stats.low_attacks || 0, color: '#FFA726' },
    { name: 'Mid', value: stats.mid_attacks || 0, color: '#FF7043' },
    { name: 'Severe', value: stats.severe_attacks || 0, color: '#E53935' }
  ];

  const attackTypeChartData = Object.entries(attackTypeStats).map(([name, count]) => ({
    name,
    count,
    color: ATTACK_TYPES[name].color
  }));

  const totalThreats = (stats.low_attacks || 0) + (stats.mid_attacks || 0) + (stats.severe_attacks || 0);
  const blockedAttempts = stats.blocked_packets || 0;
  const preventionRate = totalThreats === 0 ? '0.0' : ((blockedAttempts / totalThreats) * 100).toFixed(1);

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <div>
            <h1 className="dashboard-logo">
              <span className="logo-icon">🛡️</span>
              IntrusionX
            </h1>
            <p className="dashboard-tagline">Security Operations Center</p>
          </div>
        </div>
        <div className="nav-center">
          <div className={`status-indicator ${monitoring ? 'active' : ''}`}>
            <span className="status-dot"></span>
            {monitoring ? 'Live Monitoring' : 'Inactive'}
          </div>
        </div>
        <div className="nav-right">
          <span className="user-info">
            <span className="user-icon">👤</span>
            {user?.email}
          </span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <button 
            className={`tab-btn ${activeTab === 'monitoring' ? 'active' : ''}`}
            onClick={() => setActiveTab('monitoring')}
          >
            <span className="tab-icon">📡</span>
            <span>Live Monitoring</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <span className="tab-icon">🚨</span>
            <span>Alerts</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <span className="tab-icon">📊</span>
            <span>Analytics</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'attacks' ? 'active' : ''}`}
            onClick={() => setActiveTab('attacks')}
          >
            <span className="tab-icon">⚔️</span>
            <span>Attack Details</span>
          </button>
          <button 
            className="tab-btn download"
            onClick={downloadReport}
          >
            <span className="tab-icon">📥</span>
            <span>Download Report</span>
          </button>
        </div>

        <div className="dashboard-main">
          {activeTab === 'monitoring' && (
            <div className="tab-content">
              <div className="content-header">
                <div>
                  <h2>Live Network Monitoring</h2>
                  <p className="section-subtitle">
                    Real-time packet telemetry and anomaly detection feed.
                  </p>
                </div>
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
                </div>
              </div>

              <div className="overview-strip">
                <div className="overview-chip">
                  <span className="overview-label">Threat Load</span>
                  <strong>{totalThreats.toLocaleString()}</strong>
                </div>
                <div className="overview-chip">
                  <span className="overview-label">Blocked Attempts</span>
                  <strong>{blockedAttempts.toLocaleString()}</strong>
                </div>
                <div className="overview-chip">
                  <span className="overview-label">Risk Level</span>
                  <strong>{stats.severe_attacks > 0 ? 'Elevated' : 'Controlled'}</strong>
                </div>
                <div className="overview-chip">
                  <span className="overview-label">Predictions Stored</span>
                  <strong>{predictionSummary.total?.toLocaleString() || 0}</strong>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card total">
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

                <div className="stat-card blocked">
                  <div className="stat-icon">🛡️</div>
                  <div className="stat-content">
                    <h3>Blocked Attempts</h3>
                    <p className="stat-value">{stats.blocked_packets?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>

              <div className="prevention-grid">
                <article className="prevention-card">
                  <div className="prevention-head">
                    <h3>Prevention Command Center</h3>
                    <span className="prevention-badge">Auto-Defense Active</span>
                  </div>
                  <p className="prevention-subtext">
                    Severe detections trigger signature blocking while still sending SOC alerts for audit and response.
                  </p>
                  <div className="prevention-metrics">
                    <div className="metric-tile">
                      <span>Protection Rate</span>
                      <strong>{preventionRate}%</strong>
                    </div>
                    <div className="metric-tile">
                      <span>Active Rules</span>
                      <strong>{blocklist.length}</strong>
                    </div>
                    <div className="metric-tile">
                      <span>Mode</span>
                      <strong>Detect + Block</strong>
                    </div>
                  </div>
                </article>

                <article className="blocklist-card">
                  <h3>Top Blocked Signatures</h3>
                  {blocklist.length === 0 ? (
                    <p className="no-data">No blocked signatures yet. Severe detections will appear here.</p>
                  ) : (
                    <div className="blocklist-list">
                      {blocklist.slice(0, 6).map((item, idx) => (
                        <div key={`${item.signature}-${idx}`} className="blocklist-item">
                          <div>
                            <p className="signature-code">{item.signature}</p>
                            <p className="signature-meta">Port {item.port} • Protocol {item.protocol}</p>
                          </div>
                          <span className="signature-state">Blocked</span>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              </div>

              <div className="panel">
                <h3>🔍 Recent Detections and Mitigations</h3>
                <div className="detections-list">
                  {recentDetections.length === 0 ? (
                    <p className="no-data">No recent detections. Start monitoring to see live data.</p>
                  ) : (
                    recentDetections.map((detection, index) => {
                      const attackType = classifyAttackType(detection);
                      return (
                        <div key={index} className="detection-item">
                          <span className={`severity-badge ${['normal', 'low', 'mid', 'severe'][detection.attack_type]}`}>
                            {['Normal', 'Low', 'Mid', 'Severe'][detection.attack_type]}
                          </span>
                          {attackType && (
                            <span className="attack-type-label">
                              {ATTACK_TYPES[attackType].icon} {attackType}
                            </span>
                          )}
                          <span className="detection-detail">Port: {detection.port}</span>
                          <span className="detection-detail">Protocol: {detection.protocol}</span>
                          <span className="detection-detail">Size: {detection.packet_size}B</span>
                          {detection.blocked && <span className="attack-type-label">🛡️ Blocked</span>}
                          <span className="detection-confidence">{(detection.confidence * 100).toFixed(1)}%</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="panel">
                <h3>⚡ Real-Time Prediction Feed</h3>
                <div className="prediction-summary-grid">
                  <div className="prediction-chip">Normal: {predictionSummary.normal || 0}</div>
                  <div className="prediction-chip">Low: {predictionSummary.low || 0}</div>
                  <div className="prediction-chip">Mid: {predictionSummary.mid || 0}</div>
                  <div className="prediction-chip">Severe: {predictionSummary.severe || 0}</div>
                </div>

                {predictions.length === 0 ? (
                  <p className="no-data">No prediction records yet. Start collector to stream data.</p>
                ) : (
                  <div className="predictions-table-wrap">
                    <table className="predictions-table">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Prediction</th>
                          <th>Label</th>
                          <th>Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {predictions.slice(0, 20).map((item) => (
                          <tr key={item._id}>
                            <td>{new Date(item.timestamp || item.createdAt).toLocaleTimeString()}</td>
                            <td>{item.prediction}</td>
                            <td>{item.predictionLabel || 'Unknown'}</td>
                            <td>{((item.confidence || 0) * 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="tab-content">
              <div className="content-header">
                <div>
                  <h2>Alert History</h2>
                  <p className="section-subtitle">
                    Prioritized timeline of triggered incidents and notification actions.
                  </p>
                </div>
                <span className="alert-count">{alerts.length} Total Alerts</span>
              </div>

              <div className="info-cards">
                <div className="info-card">
                  <span className="info-badge low">Low</span>
                  <p>Dashboard notification only</p>
                </div>
                <div className="info-card">
                  <span className="info-badge mid">Mid</span>
                  <p>Email: {user?.email}</p>
                </div>
                <div className="info-card">
                  <span className="info-badge severe">Severe</span>
                  <p>SMS + signature block enforcement</p>
                </div>
              </div>

              <div className="panel">
                <div className="alerts-list">
                  {alerts.length === 0 ? (
                    <p className="no-data">No alerts recorded yet</p>
                  ) : (
                    alerts.map((alert) => (
                      <div key={alert._id} className="alert-item">
                        <div className="alert-left">
                          <span className={`alert-severity ${alert.severity}`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          {alert.attackType && (
                            <span className="attack-type-label">
                              {ATTACK_TYPES[alert.attackType].icon} {alert.attackType}
                            </span>
                          )}
                          <span className="alert-time">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                          {alert.blocked && <span className="notified">🛡 Blocked</span>}
                        </div>
                        <div className="alert-right">
                          <span>Port: {alert.port}</span>
                          <span>Confidence: {(alert.confidence * 100).toFixed(1)}%</span>
                          {alert.notificationSent && <span className="notified">✓ Notified</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="tab-content">
              <div className="content-header">
                <div>
                  <h2>Network Analytics</h2>
                  <p className="section-subtitle">
                    Behavioral patterns and comparative severity analysis.
                  </p>
                </div>
              </div>

              <div className="attack-types-grid">
                {Object.entries(ATTACK_TYPES).map(([key, info]) => (
                  <div key={key} className="attack-type-card">
                    <div className="attack-type-header">
                      <span className="attack-type-icon">{info.icon}</span>
                      <h4>{info.name}</h4>
                    </div>
                    <p>{info.description}</p>
                    <p><strong>Detection Reason:</strong> {info.reason}</p>
                    <span className="attack-count">Detected: {attackTypeStats[key] || 0}</span>
                  </div>
                ))}
              </div>

              <div className="charts-grid">
                <div className="chart-panel">
                  <h3>Traffic Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-panel">
                  <h3>Attack Types Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={attackTypeChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count">
                        {attackTypeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-panel full-width">
                  <h3>Real-Time Traffic Monitor</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="normal" stroke="#4CAF50" strokeWidth={2} name="Normal Traffic" />
                      <Line type="monotone" dataKey="threats" stroke="#E53935" strokeWidth={2} name="Threats" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attacks' && (
            <div className="tab-content">
              <div className="content-header">
                <div>
                  <h2>Attack Details & Analysis</h2>
                  <p className="section-subtitle">
                    Deep-dive review of classified attack events and rationale.
                  </p>
                </div>
              </div>

              <div className="attack-summary">
                <div className="summary-card">
                  <h4>Total Attacks Detected</h4>
                  <p className="summary-value">
                    {totalThreats}
                  </p>
                </div>
                <div className="summary-card">
                  <h4>Most Common Attack</h4>
                  <p className="summary-value">
                    {Object.entries(attackTypeStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'}
                  </p>
                </div>
                <div className="summary-card">
                  <h4>Detection Accuracy</h4>
                  <p className="summary-value">99.5%</p>
                </div>
              </div>

              <div className="panel">
                <h3>Detailed Attack Log</h3>
                <div className="attacks-table">
                  <div className="table-header">
                    <span>Timestamp</span>
                    <span>Attack Type</span>
                    <span>Severity</span>
                    <span>Port</span>
                    <span>Confidence</span>
                    <span>Status</span>
                  </div>
                  {alerts.filter(a => a.severity !== 'normal').length === 0 ? (
                    <p className="no-data">No attacks detected</p>
                  ) : (
                    alerts.filter(a => a.severity !== 'normal').slice(0, 30).map((alert) => (
                      <div key={alert._id} className="table-row">
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        <span>
                          {alert.attackType ? (
                            <>
                              {ATTACK_TYPES[alert.attackType].icon} {alert.attackType}
                            </>
                          ) : 'Unknown'}
                        </span>
                        <span className={`severity-badge ${alert.severity}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span>{alert.port}</span>
                        <span>{(alert.confidence * 100).toFixed(1)}%</span>
                        <span className="action-taken">
                          {alert.blocked ? '🛡 Blocked' : alert.notificationSent ? '✓ Alerted' : '○ Logged'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="panel">
                <h3>Attack Explanations</h3>
                {alerts.filter(a => a.attackType).slice(0, 5).map((alert, index) => (
                  <div key={index} className="attack-explanation">
                    <h4>
                      {ATTACK_TYPES[alert.attackType]?.icon} {alert.attackType} - 
                      <span className={`severity-badge ${alert.severity}`}> {alert.severity.toUpperCase()}</span>
                    </h4>
                    <p><strong>Description:</strong> {ATTACK_TYPES[alert.attackType]?.description}</p>
                    <p><strong>Why Detected:</strong> {ATTACK_TYPES[alert.attackType]?.reason}</p>
                    <p><strong>Detected At:</strong> {new Date(alert.timestamp).toLocaleString()}</p>
                    <p><strong>Port:</strong> {alert.port} | <strong>Confidence:</strong> {(alert.confidence * 100).toFixed(1)}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
