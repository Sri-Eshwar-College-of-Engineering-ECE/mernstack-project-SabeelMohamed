import '../../styles/Home.css';

function Home() {
  return (
    <div className="home">
      <div className="home">
  <section 
    className="hero" 
    style={{ 
      backgroundImage: "url('/assets/back.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      height: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      padding: 0,
      margin: 0
    }}
  >
    <div 
      className="hero-buttons" 
      style={{ 
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        justifyContent: 'center'
      }}
    >
      <a 
        href="#features" 
        style={{ 
          padding: "10px 20px",
          fontSize: "1.2rem",
          fontWeight: "bold",
          borderRadius: "5px",
          textDecoration: "none",
          color: "white",
          backgroundColor: "#4caf50",
          border: "2px solid #4caf50",
          transition: "all 0.3s ease-in-out"
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"}
        onMouseOut={(e) => e.target.style.backgroundColor = "#4caf50"}
      >
        Learn More
      </a>
      <a 
        href="#how-it-works" 
        style={{ 
          padding: "10px 20px",
          fontSize: "1.2rem",
          fontWeight: "bold",
          borderRadius: "5px",
          textDecoration: "none",
          color: "white",
          backgroundColor: "transparent",
          border: "2px solid white",
          transition: "all 0.3s ease-in-out"
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)"}
        onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
      >
        How It Works
      </a>
    </div>
  </section>
</div>



      <section id="features" className="features">
        <h2>Why Choose AgroLink?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌾</div>
            <h3>Direct Farm to Business</h3>
            <p>Connect directly with farmers or buyers, eliminating middlemen and ensuring better prices.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Verified Partners</h3>
            <p>All users are verified by our admin team to ensure secure and reliable transactions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>Bulk Orders</h3>
            <p>Efficiently manage bulk agricultural produce orders with our streamlined system.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚛</div>
            <h3>Transport Management</h3>
            <p>Integrated transport management for seamless delivery of your orders.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register</h3>
            <p>Sign up as a farmer or buyer and get your account verified</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Connect</h3>
            <p>Post or browse agricultural products and connect with partners</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Trade</h3>
            <p>Place orders and manage transactions securely</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Deliver</h3>
            <p>Coordinate with our transport system for reliable delivery</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join our growing community of farmers and buyers today!</p>
          <div className="cta-buttons">
            <a href="/farmer/register" className="btn btn-primary">Register as Farmer</a>
            <a href="/buyer/register" className="btn btn-secondary">Register as Buyer</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
