import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'

const Footer = () => {
  const navLinks = [
    { name: 'Sign In', href: '/login' },
    { name: 'Register User', href: '/register' },
  ]

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
          {/* Left Section - Logo and Description */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 max-w-2xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
                SmartVend IoT
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Real-time IoT-powered vending management system for automated retail excellence. Track inventory, process payments, and monitor machine status with instant alerts and intelligent analytics. Transform your retail operations with both online and offline payment capabilities powered by ESP32 and Razorpay integration.
              </p>
            </div>
          </div>

          {/* Right Section - Navigation Links */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="text-gray-300 hover:text-red-500 font-medium transition-colors duration-200 hover:underline decoration-2 underline-offset-4 decoration-red-500"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

