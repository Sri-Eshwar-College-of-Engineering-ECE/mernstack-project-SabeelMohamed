import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';

function FarmerLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/farmer/login`, formData);
      console.log('Login success:', res.data);
      
      localStorage.setItem('farmerId', res.data.farmerId);
      
      navigate('/farmer/dashboard');
    } catch (error) {
      setMessage('Invalid email or password');
    }
  };

  return (
    <div className="auth-container">
      <h2>Farmer Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {message && <p className="error">{message}</p>}
        
        <button type="submit" className="submit-btn">Login</button>
      </form>
    </div>
  );
}

export default FarmerLogin;
