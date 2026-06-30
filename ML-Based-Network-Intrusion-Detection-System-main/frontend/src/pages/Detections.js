import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Detections.css';

function Detections() {
  const [recentDetections, setRecentDetections] = useState([]);

  const getAuthHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }), []);

  const fetchDetections = useCallback(async () => {
    try {
      const response = await axios.get('/api/monitoring/status', getAuthHeaders());
      setRecentDetections(response.data.recent_detections || []);
    } catch (error) {
      console.error('Failed to fetch detections:', error);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchDetections();
    const interval = setInterval(fetchDetections, 2000);
    return () => clearInterval(interval);
  }, [fetchDetections]);

  return (
    <div className="detections-page">
      <div className="page-header">
        <h2>🔍 Live Detections</h2>
        <p>Real-time network packet analysis</p>
      </div>

      <div className="detections-container">
        {recentDetections.length === 0 ? (
          <div className="no-data-card">
            <span className="no-data-icon">📡</span>
            <h3>No Detections Yet</h3>
            <p>Start monitoring to see live network packet detections</p>
          </div>
        ) : (
          <div className="detections-grid">
            {recentDetections.map((detection, index) => (
              <div key={index} className="detection-card">
                <div className="detection-header">
                  <span className={`severity-badge ${['normal', 'low', 'mid', 'severe'][detection.attack_type]}`}>
                    {['Normal', 'Low', 'Mid', 'Severe'][detection.attack_type]}
                  </span>
                  <span className="detection-time">
                    {new Date(detection.timestamp * 1000).toLocaleTimeString()}
                  </span>
                </div>
                <div className="detection-body">
                  <div className="detection-row">
                    <span className="label">Confidence:</span>
                    <span className="value">{(detection.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="detection-row">
                    <span className="label">Port:</span>
                    <span className="value">{detection.port}</span>
                  </div>
                  <div className="detection-row">
                    <span className="label">Protocol:</span>
                    <span className="value">{detection.protocol}</span>
                  </div>
                  <div className="detection-row">
                    <span className="label">Packet Size:</span>
                    <span className="value">{detection.packet_size} bytes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Detections;
