import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">IntrusionX</span>
          </div>
          <div className="nav-links">
            <button className="nav-link" onClick={() => scrollToSection('home')}>Home</button>
            <button className="nav-link" onClick={() => scrollToSection('features')}>Features</button>
            <button className="nav-link" onClick={() => scrollToSection('how-it-works')}>How It Works</button>
          </div>
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn-primary" onClick={() => navigate('/signup')}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            SOC-Grade Platform
          </div>
          <h1 className="hero-title">
            Real-Time Network
            <span className="gradient-text"> Defense Platform</span>
          </h1>
          <p className="hero-subtitle">
            Protect your network with AI-powered threat detection, instant alerts, and automatic signature blocking for severe attacks.
          </p>
          <div className="hero-highlights">
            <span>99.5% Detection Accuracy</span>
            <span>Auto Block on Severe Patterns</span>
            <span>24/7 Monitoring Pipeline</span>
          </div>
          <div className="hero-buttons">
            <button className="btn-large btn-primary" onClick={() => navigate('/signup')}>
              Start Monitoring
            </button>
            <button className="btn-large btn-outline" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="pulse-circle"></div>
          <div className="pulse-circle delay-1"></div>
          <div className="pulse-circle delay-2"></div>
          <div className="status-card status-card-1">
            <h4>Detection Engine</h4>
            <p>Live stream active</p>
          </div>
          <div className="status-card status-card-2">
            <h4>Mitigation Layer</h4>
            <p>Blocking severe signatures</p>
          </div>
          <div className="status-card status-card-3">
            <h4>Alert Routing</h4>
            <p>Email + SMS escalation</p>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <h2 className="section-title">Powerful Security Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Real-Time Monitoring</h3>
            <p>Continuous network traffic analysis with instant threat detection</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Detection</h3>
            <p>Machine learning model with 99.5% accuracy in threat classification</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Live Analytics</h3>
            <p>Comprehensive dashboard with real-time statistics and insights</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚨</div>
            <h3>Smart Alerts</h3>
            <p>Multi-level notifications: Dashboard, Email, and SMS alerts</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧱</div>
            <h3>Auto Blocking</h3>
            <p>Severe signatures are blocked in real-time to reduce repeated attack impact</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Threat Classification</h3>
            <p>Automatic severity rating: Low, Medium, and Severe threats</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>End-to-end encryption with secure authentication</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Sign Up</h3>
              <p>Create your account with email and phone number for alerts</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Start Monitoring</h3>
              <p>Click the start button to begin real-time network monitoring</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>AI Analysis</h3>
              <p>Our ML model analyzes every packet and classifies threats</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Get Alerts</h3>
              <p>Receive instant notifications based on threat severity level</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">5</div>
            <div className="step-content">
              <h3>Auto Block Severe Patterns</h3>
              <p>Severe signatures are added to the blocklist and prevented on repeat attempts</p>
            </div>
          </div>
        </div>
        <div className="cta-section">
          <h3>Ready to Secure Your Network?</h3>
          <button className="btn-large btn-primary" onClick={() => navigate('/signup')}>
            Get Started Now
          </button>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 IntrusionX. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;
