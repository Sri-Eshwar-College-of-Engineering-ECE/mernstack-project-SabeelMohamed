import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AboutProject from './pages/AboutProject'
import HowItWorksPage from './pages/HowItWorksPage'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import Cart from './pages/Cart'
import PaymentSuccess from './pages/PaymentSuccess'
import OfflinePayment from './pages/OfflinePayment'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/offline-payment" element={<OfflinePayment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutProject />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
              </Routes>
            </>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
