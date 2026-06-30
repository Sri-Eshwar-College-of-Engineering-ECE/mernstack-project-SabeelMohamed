import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  CheckCircle, 
  Loader, 
  AlertCircle,
  Clock,
  Smartphone,
  ShieldCheck
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

const OfflinePayment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { cart, total } = location.state || {}
  
  const [showConsentModal, setShowConsentModal] = useState(true)
  const [consentGiven, setConsentGiven] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpData, setOtpData] = useState(null)
  const [userOtpInput, setUserOtpInput] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [hardwareOnline, setHardwareOnline] = useState(false)
  const [checkingHardware, setCheckingHardware] = useState(true)
  const [otpError, setOtpError] = useState('') // New state for OTP specific errors

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/user')
      return
    }
    
    // Check hardware status immediately
    checkHardwareStatus()
    
    // Check hardware status every 3 seconds
    const interval = setInterval(checkHardwareStatus, 3000)
    return () => clearInterval(interval)
  }, [cart, navigate])
  
  const checkHardwareStatus = async () => {
    try {
      const response = await fetch('https://vending-machine-r93c.onrender.com/api/offline-payment/hardware-status')
      const data = await response.json()
      
      if (data.success) {
        setHardwareOnline(data.data.online)
      }
      setCheckingHardware(false)
    } catch (error) {
      console.error('Hardware status check error:', error)
      setHardwareOnline(false)
      setCheckingHardware(false)
    }
  }

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (otpData && otpData.expiryTime) {
      const interval = setInterval(() => {
        const now = Date.now()
        const remaining = Math.max(0, Math.floor((otpData.expiryTime - now) / 1000))
        setTimeRemaining(remaining)
        
        if (remaining === 0) {
          clearInterval(interval)
          setError('OTP has expired. Please generate a new one.')
        }
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [otpData])

  // Cooldown timer
  useEffect(() => {
    if (cooldownTime > 0) {
      const interval = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [cooldownTime])

  const requestOtp = async () => {
    setLoading(true)
    setOtpError('')
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://vending-machine-r93c.onrender.com/api/offline-payment/generate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cart: cart.map(item => ({
            product: item._id,
            quantity: item.quantity
          })),
          amount: total
        })
      })

      const data = await response.json()

      if (!data.success) {
        if (response.status === 429) {
          setCooldownTime(data.remainingTime || 30)
          setOtpError(data.message)
        } else if (response.status === 503) {
          if (data.message.includes('timeout')) {
            setOtpError('Hardware timeout: ESP32 did not respond. Please check hardware connection.')
          } else {
            setOtpError('Hardware not connected. Please ensure the vending machine is online.')
          }
        } else {
          setOtpError(data.message || 'Failed to generate OTP')
        }
        setLoading(false)
        return
      }

      setOtpData({
        otp: data.data.otp,
        qrData: data.data.qrData,
        orderId: data.data.orderId,
        expiryTime: data.data.expiryTime,
        expiresIn: data.data.expiresIn
      })
      setTimeRemaining(data.data.expiresIn)
      setCooldownTime(30) // Set 30 second cooldown
      setLoading(false)
    } catch (error) {
      console.error('Generate OTP error:', error)
      setOtpError('Failed to generate OTP. Please try again.')
      setLoading(false)
    }
  }

  const handleConsentAccept = () => {
    setConsentGiven(true)
    setShowConsentModal(false)
    setOtpError('') // Clear any previous OTP specific error
    
    // Always proceed - let the requestOtp function handle hardware check
    requestOtp()
  }

  const handleVerifyOTP = async () => {
    if (userOtpInput.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setVerifying(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://vending-machine-r93c.onrender.com/api/offline-payment/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          otp: userOtpInput,
          orderId: otpData.orderId
        })
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || 'Invalid OTP')
        setVerifying(false)
        return
      }

      // Clear cart
      localStorage.removeItem('cart')
      
      // Navigate to success page
      navigate('/payment-success', { state: { transaction: data.data } })
    } catch (error) {
      console.error('Verify OTP error:', error)
      setError('Failed to verify OTP. Please try again.')
      setVerifying(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Debug: Log cart and total
  console.log('OfflinePayment - Cart:', cart);
  console.log('OfflinePayment - Total:', total);
  console.log('OfflinePayment - Show Consent Modal:', showConsentModal);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <h1 className="text-4xl font-bold text-slate-900">Offline Payment</h1>
          <p className="text-slate-600 mt-2">Pay Later with Autopay</p>
        </div>

        {/* Consent Modal */}
        <AnimatePresence>
          {showConsentModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
              style={{ zIndex: 9999 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-10 h-10 text-purple-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-4">
                  Autopay Consent
                </h2>
                
                {/* REMOVED: Hardware Status from Consent Modal */}
                
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <p className="text-slate-700 text-sm leading-relaxed">
                    By proceeding with offline payment, you agree to:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Enable autopay for this transaction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Pay ₹{total} via UPI autopay</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Verify payment using OTP from your mobile app</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/cart')}
                    className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConsentAccept}
                    className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg"
                  >
                    I Accept
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {consentGiven && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* QR Code Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Scan QR Code</h2>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                  <p className="text-slate-600">Generating OTP...</p>
                </div>
              ) : otpError ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                  <p className="text-red-600 font-semibold mb-2">Error</p>
                  <p className="text-slate-600 text-center text-sm">
                    {otpError}
                  </p>
                </div>
              ) : otpData ? (
                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="bg-slate-50 rounded-xl p-6 flex flex-col items-center">
                    <QRCodeSVG 
                      value={otpData.qrData}
                      size={256}
                      level="H"
                      includeMargin={true}
                      className="mb-4"
                    />
                    <p className="text-sm text-slate-600 text-center">
                      Scan this QR code with your dedicated mobile app
                    </p>
                  </div>

                  {/* Info Message */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800 text-center font-semibold">
                      ✓ OTP generated successfully!
                    </p>
                  </div>

                  {/* Timer */}
                  <div className="flex items-center justify-center gap-2 text-slate-600">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">
                      Expires in: {formatTime(timeRemaining)}
                    </span>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Amount</span>
                      <span className="font-bold text-slate-900">₹{total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Items</span>
                      <span className="font-semibold text-slate-900">{cart.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Payment Method</span>
                      <span className="font-semibold text-slate-900">Offline Autopay</span>
                    </div>
                  </div>

                  {/* Regenerate OTP Button */}
                  <button
                    onClick={requestOtp}
                    disabled={cooldownTime > 0}
                    className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cooldownTime > 0 
                      ? `Regenerate OTP (${cooldownTime}s)` 
                      : 'Regenerate OTP'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <Smartphone className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-slate-600">No OTP generated yet</p>
                </div>
              )}
            </div>

            {/* OTP Verification Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Verify Payment</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Enter OTP from Mobile App
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    value={userOtpInput}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      setUserOtpInput(value)
                      setError('')
                    }}
                    placeholder="000000"
                    className="w-full px-4 py-4 text-2xl font-bold text-center tracking-widest border-2 border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!otpData || verifying || !hardwareOnline}
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleVerifyOTP}
                  disabled={!otpData || verifying || userOtpInput.length !== 6 || timeRemaining === 0 || !hardwareOnline}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {verifying ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Verify & Complete Payment
                    </>
                  )}
                </button>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Instructions
                  </h3>
                  <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                    <li>Open your dedicated mobile app</li>
                    <li>Scan the QR code displayed on the left</li>
                    <li>The app will show you the OTP</li>
                    <li>Enter the OTP above to complete payment</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OfflinePayment
