import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './History.css';

function History() {
  const [history, setHistory] = useState([]);

  const getAuthHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }), []);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await axios.get('/api/monitoring/history?limit=100', getAuthHeaders());
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="history-page">
      <div className="page-header">
        <h2>📜 Monitoring History</h2>
        <p>Historical network monitoring data</p>
      </div>

      <div className="history-container">
        {history.length === 0 ? (
          <div className="no-data-card">
            <span className="no-data-icon">📊</span>
            <h3>No History Data</h3>
            <p>Start monitoring to build your network history</p>
          </div>
        ) : (
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Total Packets</th>
                  <th>Normal</th>
                  <th>Low</th>
                  <th>Mid</th>
                  <th>Severe</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.timestamp).toLocaleString()}</td>
                    <td>{record.totalPackets?.toLocaleString()}</td>
                    <td className="normal">{record.normalPackets?.toLocaleString()}</td>
                    <td className="low">{record.lowAttacks?.toLocaleString()}</td>
                    <td className="mid">{record.midAttacks?.toLocaleString()}</td>
                    <td className="severe">{record.severeAttacks?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
