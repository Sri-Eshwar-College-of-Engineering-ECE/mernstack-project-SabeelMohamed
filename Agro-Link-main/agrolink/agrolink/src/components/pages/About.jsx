import '../../styles/About.css';

function About() {
  return (
    <div className="about">
     <section 
  className="about-hero" 
  style={{ 
    backgroundImage: "url('/assets/q.jpg')", 
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "90vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
>
</section>


      <section className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            At AgroLink, we're committed to transforming the agricultural marketplace by connecting farmers directly 
            with buyers, eliminating unnecessary intermediaries, and ensuring fair prices for all parties involved.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Vision</h2>
          <p>
            We envision a future where agricultural trade is efficient, transparent, and beneficial for both farmers 
            and buyers, powered by cutting-edge technology and sustainable practices.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <div className="card-icon">🌱</div>
            <h3>Empowering Farmers</h3>
            <p>
              We provide farmers with direct access to markets, better prices, and tools to grow their business.
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon">🤝</div>
            <h3>Supporting Buyers</h3>
            <p>
              We help buyers source quality products directly from verified farmers at competitive prices.
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon">🌍</div>
            <h3>Sustainable Practices</h3>
            <p>
              We promote environmentally conscious farming and trading practices.
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon">📱</div>
            <h3>Technology Driven</h3>
            <p>
              We leverage modern technology to make agricultural trade more efficient.
            </p>
          </div>
        </div>

        <div className="team-section">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              
              <h3>Sabeel Mohamed</h3>
              <p>SECE</p>
            </div>
            <div className="team-member">
              
              <h3>Roshini</h3>
              <p>SECE</p>
            </div>
            <div className="team-member">
              
              <h3>Sandhya</h3>
              <p>SECE</p>
            </div>
            <div className="team-member">
              
              <h3>Shri Harini</h3>
              <p>SECE</p>
            </div>
            <div className="team-member">
          
              <h3>Shrivarsha</h3>
              <p>SECE</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
