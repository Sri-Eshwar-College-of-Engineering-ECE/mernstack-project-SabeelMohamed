import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HowItWorks.css';

function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      number: '01',
      icon: '🔌',
      title: 'Connect Your Network',
      description: 'Integrate IntrusionX with your network infrastructure in minutes. Our system supports all major network protocols and configurations.',
      details: ['Quick Setup', 'Zero Configuration', 'Universal Compatibility']
    },
    {
      number: '02',
      icon: '🔍',
      title: 'Real-Time Monitoring',
      description: 'Our AI engine continuously analyzes network traffic, examining every packet for potential threats and anomalies.',
      details: ['Deep Packet Inspection', 'Pattern Recognition', 'Behavioral Analysis']
    },
    {
      number: '03',
      icon: '🤖',
      title: 'AI Detection',
      description: 'Machine learning algorithms trained on millions of attack patterns identify threats with 99.5% accuracy in real-time.',
      details: ['Random Forest ML', 'Continuous Learning', 'Adaptive Detection']
    },
    {
      number: '04',
      icon: '🚨',
      title: 'Instant Alerts',
      description: 'Get notified immediately when threats are detected. Multi-channel alerts ensure you never miss critical security events.',
      details: ['Email Notifications', 'SMS Alerts', 'Dashboard Updates']
    },
    {
      number: '05',
      icon: '🧱',
      title: 'Automatic Blocking',
      description: 'Severe attack signatures are automatically blocked to prevent repeated exploit attempts during live monitoring.',
      details: ['Signature Enforcement', 'Blocked Attempt Tracking', 'Live Mitigation Status']
    },
    {
      number: '06',
      icon: '📊',
      title: 'Analyze & Report',
      description: 'Access comprehensive analytics and detailed reports. Understand your security posture with interactive visualizations.',
      details: ['Real-Time Charts', 'Historical Data', 'Export Reports']
    },
    {
      number: '07',
      icon: '🛡️',
      title: 'Continuous Protection',
      description: 'Our system learns from every threat, continuously improving detection capabilities to protect against emerging attacks.',
      details: ['24/7 Monitoring', 'Auto-Updates', 'Proactive Defense']
    }
  ];

  const techStack = [
    { name: 'Machine Learning', icon: '🤖', desc: 'Random Forest Algorithm' },
    { name: 'Real-Time Processing', icon: '⚡', desc: 'Sub-100ms Response' },
    { name: 'Cloud Infrastructure', icon: '☁️', desc: 'Scalable & Reliable' },
    { name: 'Secure Database', icon: '🔐', desc: 'MongoDB Atlas' }
  ];

  return (
    <div className="how-it-works-page">
      <nav className="how-navbar">
        <div className="nav-brand">
          <span className="brand-icon">🛡️</span>
          <span className="brand-text">IntrusionX</span>
        </div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/features">Features</a>
          <a href="/how-it-works" className="active">How It Works</a>
          <button onClick={() => navigate('/login')} className="nav-btn">Login</button>
          <button onClick={() => navigate('/signup')} className="nav-btn-primary">Get Started</button>
        </div>
      </nav>

      <section className="how-hero">
        <div className="how-hero-content">
          <h1 className="how-title">
            How IntrusionX
            <span className="gradient-text"> Protects Your Network</span>
          </h1>
          <p className="how-subtitle">
            A simple, powerful process that keeps your infrastructure secure 24/7
          </p>
        </div>
      </section>

      <section className="steps-section">
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-card" style={{ animationDelay: `${index * 0.15}s` }}>
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              <ul className="step-details">
                {step.details.map((detail, idx) => (
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

      <section className="tech-section">
        <h2 className="section-title">Powered by Advanced Technology</h2>
        <div className="tech-grid">
          {techStack.map((tech, index) => (
            <div key={index} className="tech-card">
              <div className="tech-icon">{tech.icon}</div>
              <h3>{tech.name}</h3>
              <p>{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="workflow-section">
        <h2 className="section-title">Complete Workflow</h2>
        <div className="workflow-visual">
          <div className="workflow-step">
            <div className="workflow-icon">🌐</div>
            <p>Network Traffic</p>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="workflow-icon">🔍</div>
            <p>Packet Analysis</p>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="workflow-icon">🤖</div>
            <p>AI Detection</p>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="workflow-icon">🚨</div>
            <p>Alert System</p>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="workflow-icon">🧱</div>
            <p>Block Signatures</p>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="workflow-icon">📊</div>
            <p>Dashboard</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of organizations protecting their networks with IntrusionX</p>
          <button onClick={() => navigate('/signup')} className="cta-button">
            <span>Try Now!</span>
            <span className="btn-icon">→</span>
          </button>
        </div>
      </section>

      <footer className="how-footer">
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

export default HowItWorks;
