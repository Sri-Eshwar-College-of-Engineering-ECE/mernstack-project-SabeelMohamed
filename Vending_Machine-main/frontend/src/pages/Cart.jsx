import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  Smartphone,
  ArrowLeft,
  CheckCircle,
  Loader
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('online')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]')
    
    if (!userData) {
      navigate('/login')
      return
    }
    
    if (cartData.length === 0) {
      navigate('/user')
      return
    }

    setUser(userData)
    setCart(cartData)
  }, [])

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Suppress Razorpay console warnings - these are harmless browser errors
      const originalError = console.error
      console.error = (...args) => {
        if (!args[0]?.includes?.('x-rtb-fingerprint-id') && 
            !args[0]?.includes?.('Expected length') &&
            !args[0]?.includes?.('unsafe header')) {
          originalError.apply(console, args)
        }
      }
      
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        console.error = originalError
        resolve(true)
      }
      script.onerror = () => {
        console.error = originalError
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const handleOnlinePayment = async () => {
    setLoading(true)

    try {
      // Load Razorpay script
      const res = await loadRazorpayScript()
      if (!res) {
        alert('Razorpay SDK failed to load. Please check your internet connection.')
        setLoading(false)
        return
      }

      // Create order on backend
      const token = localStorage.getItem('token')
      const orderResponse = await fetch('https://vending-machine-r93c.onrender.com/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: getTotalPrice(),
          cart: cart.map(item => ({
            product: item._id,
            quantity: item.quantity
          }))
        })
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        alert(orderData.message || 'Failed to create order')
        setLoading(false)
        return
      }

      // Razorpay options
      const options = {
        key: 'rzp_test_RP2Hw84XTNJuAk',
        amount: orderData.data.amount,
        currency: 'INR',
        name: 'SmartVend IoT',
        description: 'Vending Machine Purchase',
        order_id: orderData.data.razorpayOrderId,
        handler: async function (response) {
          // Verify payment on backend
          try {
            const verifyResponse = await fetch('https://vending-machine-r93c.onrender.com/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.data.orderId
              })
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              // Clear cart
              localStorage.removeItem('cart')
              // Show success and redirect
              navigate('/payment-success', { state: { transaction: verifyData.data } })
            } else {
              alert('Payment verification failed')
            }
          } catch (error) {
            console.error('Verification error:', error)
            alert('Payment verification failed')
          }
          setLoading(false)
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
          }
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
      setLoading(false)
    }
  }

  const handleOfflinePayment = () => {
    // Navigate to offline payment page (ESP32 OTP method)
    navigate('/offline-payment', { state: { cart, total: getTotalPrice() } })
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/user')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </button>
          <h1 className="text-4xl font-bold text-slate-900">Checkout</h1>
          <p className="text-slate-600 mt-2">Complete your purchase</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4 pb-4 border-b border-slate-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{item.name}</h3>
                      <p className="text-sm text-slate-600">{item.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-slate-600">Qty: {item.quantity}</span>
                        <span className="font-bold text-blue-600">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                {/* Online Payment */}
                <button
                  onClick={() => setPaymentMethod('online')}
                  className={`w-full p-6 rounded-xl border-2 transition-all ${
                    paymentMethod === 'online'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      paymentMethod === 'online' ? 'bg-blue-600' : 'bg-slate-100'
                    }`}>
                      <CreditCard className={`w-6 h-6 ${
                        paymentMethod === 'online' ? 'text-white' : 'text-slate-600'
                      }`} />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-bold text-slate-900">Online Payment</h3>
                      <p className="text-sm text-slate-600">Pay using Razorpay (UPI, Cards, Wallets)</p>
                    </div>
                    {paymentMethod === 'online' && (
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                </button>

                {/* Offline Payment */}
                <button
                  onClick={() => setPaymentMethod('offline')}
                  className={`w-full p-6 rounded-xl border-2 transition-all ${
                    paymentMethod === 'offline'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      paymentMethod === 'offline' ? 'bg-purple-600' : 'bg-slate-100'
                    }`}>
                      <Smartphone className={`w-6 h-6 ${
                        paymentMethod === 'offline' ? 'text-white' : 'text-slate-600'
                      }`} />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-bold text-slate-900">Offline Payment</h3>
                      <p className="text-sm text-slate-600">Pay Later by Autopay</p>
                    </div>
                    {paymentMethod === 'offline' && (
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Price Details</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (0%)</span>
                  <span>₹0</span>
                </div>
                <div className="border-t-2 border-slate-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">₹{getTotalPrice()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={paymentMethod === 'online' ? handleOnlinePayment : handleOfflinePayment}
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {paymentMethod === 'online' ? 'Pay Now' : 'Generate OTP'}
                  </>
                )}
              </button>

              <p className="text-xs text-slate-500 text-center mt-4">
                By proceeding, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
