import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/auth.css';

// Import components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Products from './components/pages/Products';
import FarmerLogin from './components/auth/FarmerLogin';
import FarmerDashboard from './components/farmer/FarmerDashboard';
import FarmerRegister from './components/auth/FarmerRegister';
import BuyerLogin from './components/auth/BuyerLogin';
import BuyerDashboard from './components/buyer/BuyerDashboard';
import BuyerRegister from './components/auth/BuyerRegister';
import AdminLogin from './components/auth/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

// Stripe success/cancel pages
import Success from './components/pages/Success';
import Cancel from './components/pages/Cancel';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="/farmer/login" element={<FarmerLogin />} />
            <Route path="/farmer/register" element={<FarmerRegister />} />
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/buyer/login" element={<BuyerLogin />} />
            <Route path="/buyer/register" element={<BuyerRegister />} />
            <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Stripe payment result routes */}
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
