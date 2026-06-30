import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';

function Header() {
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo with Image & Text */}
        <Link to="/" className="logo" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img 
            src="/assets/logo.jpg"  // Ensure logo.jpg is inside the public/assets folder
            alt="AgroLink Logo" 
            style={{ height: "50px", width: "auto", marginRight: "10px" }} 
          />
          <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "green" }}>AgroLink</span>
        </Link>
        
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          
          <div className="auth-dropdown">
            <button 
              className="auth-trigger"
              onClick={() => setShowAuthMenu(!showAuthMenu)}
            >
              Login / Register
            </button>
            
            {showAuthMenu && (
              <div className="dropdown-menu">
                <div className="dropdown-section">
                  <h3>Farmer</h3>
                  <Link to="/farmer/login" onClick={() => setShowAuthMenu(false)}>Login</Link>
                  <Link to="/farmer/register" onClick={() => setShowAuthMenu(false)}>Register</Link>
                </div>
                <div className="dropdown-section">
                  <h3>Buyer</h3>
                  <Link to="/buyer/login" onClick={() => setShowAuthMenu(false)}>Login</Link>
                  <Link to="/buyer/register" onClick={() => setShowAuthMenu(false)}>Register</Link>
                </div>
                <div className="dropdown-section">
                  <h3>Admin</h3>
                  <Link to="/admin/login" onClick={() => setShowAuthMenu(false)}>Login</Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
