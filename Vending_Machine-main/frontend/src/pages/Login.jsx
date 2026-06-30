import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ShoppingBag, ArrowRight, Shield, Zap, Users, Home, CheckCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('https://vending-machine-r93c.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data))
        
        // Show success message
        setSuccess(true)
        
        // Redirect based on role after 1.5 seconds
        setTimeout(() => {
          if (data.data.role === 'admin') {
            navigate('/admin')
          } else {
            navigate('/user')
          }
        }, 1500)
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Unable to connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 opacity-30"></div>
      
      <div className="w-full max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding & Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="bg-blue-600 rounded-3xl p-12 text-white shadow-2xl">
              {/* Back to Home Button */}
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 text-white/90 hover:text-white mb-6 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span className="text-sm font-medium">Back to Home</span>
                </motion.button>
              </Link>

              {/* Logo */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">SmartVend IoT</h1>
                  <p className="text-sm text-blue-100">Intelligent Vending Management</p>
                </div>
              </div>

              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Welcome Back
              </h2>
              
              <p className="text-base text-blue-100 leading-relaxed mb-4">
                Secure access to your IoT-enabled vending platform.
              </p>
              
              <p className="text-base text-blue-100 leading-relaxed">
                Get a seamless purchase experience all in one go with our smart vending solution.
              </p>

              {/* Decorative Elements */}
              <div className="mt-12 relative">
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-200">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">SmartVend IoT</h1>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h2>
                <p className="text-slate-600">Enter your credentials to access your account</p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Login successful! Redirecting...</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Login As
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole('user')}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                        role === 'user'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      User
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                        role === 'admin'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-900 placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-900 placeholder-slate-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? 'Logging in...' : 'Login'}</span>
                  {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </motion.button>
              </form>

              {/* Register Link */}
              <p className="mt-6 text-center text-slate-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-blue-600 hover:text-teal-700 transition-colors">
                  Register
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Login
