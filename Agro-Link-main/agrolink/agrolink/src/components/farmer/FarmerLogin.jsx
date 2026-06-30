import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FarmerLogin = () => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically make an API call to authenticate
      // For now, we'll just check if the fields are filled
      if (!formData.name || !formData.contactNumber || !formData.password) {
        setError('Please fill in all fields');
        return;
      }

      // Store farmer data in localStorage (in a real app, this would be stored on a server)
      const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
      const existingFarmer = farmers.find(f => 
        f.contactNumber === formData.contactNumber && 
        f.password === formData.password
      );

      if (existingFarmer) {
        // Store farmer ID in localStorage for future reference
        localStorage.setItem('farmerId', existingFarmer.id);
        navigate('/farmer/dashboard');
      } else {
        setError('Invalid contact number or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Farmer Login</h2>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              placeholder="Enter your contact number"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <p>Don't have an account? <a href="/farmer/register">Register here</a></p>
        </div>
      </div>
    </div>
  );
};

export default FarmerLogin;
