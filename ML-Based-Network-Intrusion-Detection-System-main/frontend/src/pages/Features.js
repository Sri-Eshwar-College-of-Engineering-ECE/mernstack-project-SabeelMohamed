import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Features.css';

function Features() {
  const navigate = useNavigate();

  const pillars = [
    {
      title: 'Detection Engine',
      text: 'Real-time models continuously score packet behavior and flag attack signatures in milliseconds.'
    },
    {
      title: 'Response Workflow',
      text: 'Escalate incidents with alert routing, risk scoring, signature blocking, and contextual evidence for fast triage.'
    },
    {
      title: 'Executive Visibility',
      text: 'Board-ready reporting, trend snapshots, and compliance-focused audit summaries.'
    }
  ];

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms trained on millions of network patterns',
      details: ['Random Forest Classification', '99.5% Accuracy Rate', 'Continuous Learning']
    },
    {
      icon: '⚡',
      title: 'Real-Time Monitoring',
      description: 'Instant threat detection with sub-100ms response time',
      details: ['Live Network Analysis', 'Instant Alerts', 'Zero Delay Processing']
    },
    {
      icon: '🔔',
      title: 'Multi-Channel Alerts',
      description: 'Get notified through multiple channels based on threat severity',
      details: ['Email Notifications', 'SMS Alerts', 'Dashboard Updates']
    },
    {
      icon: '🧱',
      title: 'Active Threat Prevention',
      description: 'Severe detections are converted into block signatures to prevent repeated attack patterns',
      details: ['Signature Blocking', 'Blocked Attempt Counter', 'Mitigation Timeline']
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Comprehensive insights with interactive charts and reports',
      details: ['Traffic Visualization', 'Threat Patterns', 'Historical Data']
    },
    {
      icon: '🛡️',
      title: 'Threat Classification',
      description: 'Intelligent categorization of threats by severity level',
      details: ['Low Risk Monitoring', 'Medium Risk Alerts', 'Severe Threat Response']
    },
    {
      icon: '🔍',
      title: 'Deep Packet Inspection',
      description: 'Analyze network packets at the deepest level for hidden threats',
      details: ['Protocol Analysis', 'Payload Inspection', 'Anomaly Detection']
    }
  ];

  return (
    <div className="features-page">
      <nav className="features-navbar">
        <div className="nav-brand">
          <span className="brand-icon">🛡️</span>
          <span className="brand-text">IntrusionX</span>
        </div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/features" className="active">Features</a>
          <a href="/how-it-works">How It Works</a>
          <button onClick={() => navigate('/login')} className="nav-btn">Login</button>
          <button onClick={() => navigate('/signup')} className="nav-btn-primary">Get Started</button>
        </div>
      </nav>

      <section className="features-hero">
        <div className="features-hero-content">
          <h1 className="features-title">
            Powerful Features for
            <span className="gradient-text"> Complete Protection</span>
          </h1>
          <p className="features-subtitle">
            Everything you need to secure your network infrastructure with cutting-edge technology
          </p>
        </div>
      </section>

      <section className="features-main">
        <div className="pillars-grid">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="pillar-card">
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>

        <div className="features-container">
          {features.map((feature, index) => (
            <div key={index} className="feature-box" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="feature-box-icon">{feature.icon}</div>
              <h3 className="feature-box-title">{feature.title}</h3>
              <p className="feature-box-description">{feature.description}</p>
              <ul className="feature-box-details">
                {feature.details.map((detail, idx) => (
                  <li key={idx}>
                    <span className="check-icon">✓</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Secure Your Network?</h2>
          <p>Start your free trial today and experience enterprise-grade security</p>
          <button onClick={() => navigate('/signup')} className="cta-button">
            <span>Try Now!</span>
            <span className="btn-icon">→</span>
          </button>
        </div>
      </section>

      <footer className="features-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-icon">🛡️</span>
            <span>IntrusionX</span>
          </div>
          <p>&copy; 2026 IntrusionX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Features;
