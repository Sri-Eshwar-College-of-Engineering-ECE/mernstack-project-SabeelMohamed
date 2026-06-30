import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <nav className="home-navbar">
        <div className="nav-brand">
          <span className="brand-icon">🛡️</span>
          <span className="brand-text">IntrusionX</span>
        </div>
        <div className="nav-links">
          <a href="/" className="active">Home</a>
          <a href="/features">Features</a>
          <a href="/how-it-works">How It Works</a>
          <button onClick={() => navigate('/login')} className="nav-btn">Login</button>
          <button onClick={() => navigate('/signup')} className="nav-btn-primary">Get Started</button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">⚡</span>
            <span>AI-Powered Security</span>
          </div>
          <h1 className="hero-title">
            Protect Your Network with
            <span className="gradient-text"> Detect + Alert + Block</span>
          </h1>
          <p className="hero-subtitle">
            Advanced machine learning algorithms detect and prevent network intrusions 
            before they compromise your systems. Stay secure 24/7 with intelligent monitoring.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/signup')} className="btn-primary">
              <span>Try Now!</span>
              <span className="btn-icon">→</span>
            </button>
            <button onClick={() => navigate('/features')} className="btn-secondary">
              Explore Platform
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-value">99.5%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-value">&lt;100ms</div>
              <div className="stat-label">Response Time</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🔒</div>
              <div className="stat-value">24/7</div>
              <div className="stat-label">Monitoring</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🛡️</div>
              <div className="stat-value">Auto</div>
              <div className="stat-label">Blocking</div>
            </div>
          </div>

          <div className="trust-strip">
            <span>Trusted by SOC teams</span>
            <span>Zero-day aware engine</span>
            <span>Enterprise-ready onboarding</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card card-1">
            <div className="card-icon">🔍</div>
            <div className="card-title">Real-Time Analysis</div>
          </div>
          <div className="visual-card card-2">
            <div className="card-icon">🚨</div>
            <div className="card-title">Instant Alerts</div>
          </div>
          <div className="visual-card card-3">
            <div className="card-icon">📊</div>
            <div className="card-title">Detailed Reports</div>
          </div>
        </div>
      </section>

      <section className="features-preview">
        <h2 className="section-title">Why Choose IntrusionX?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Detection</h3>
            <p>Machine learning algorithms that adapt and improve with every threat detected</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Real-time monitoring with instant threat detection and response</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Multi-Channel Alerts</h3>
            <p>Get notified via email, SMS, and dashboard notifications</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧱</div>
            <h3>Automatic Prevention</h3>
            <p>Severe signatures are blocked automatically and tracked in your SOC dashboard</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Advanced Analytics</h3>
            <p>Comprehensive insights and visualizations of your network security</p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
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

export default Home;
