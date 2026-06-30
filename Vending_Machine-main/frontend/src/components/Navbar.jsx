import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Project', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-white/80 backdrop-blur-lg shadow-md border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2 sm:space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-slate-900">SmartVend IoT</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Intelligent Vending Management</p>
            </div>
          </motion.div>

          {/* Desktop Navigation - Right Side */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-slate-600 hover:text-blue-900 font-medium text-sm transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Login Button */}
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Login
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-900"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg border-t"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-primary-600 font-medium"
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md">
                  Login
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
