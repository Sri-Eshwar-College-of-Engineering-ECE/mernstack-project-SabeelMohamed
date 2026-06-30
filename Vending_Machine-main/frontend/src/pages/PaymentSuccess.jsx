import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Home, FileText } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const transaction = location.state?.transaction
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!transaction) {
      navigate('/user', { replace: true })
      return
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [transaction, navigate])

  useEffect(() => {
    if (countdown === 0 && transaction) {
      navigate('/user', { replace: true })
    }
  }, [countdown, transaction, navigate])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-16 h-16 text-green-600" />
        </motion.div>

        <h1 className="text-4xl font-bold text-slate-900 mb-4">Payment Successful!</h1>
        <p className="text-2xl text-green-600 font-bold mb-4">
          Thanks for your purchase!
        </p>
        <p className="text-xl text-slate-700 mb-8">
          Please collect your item!!
        </p>
        <p className="text-sm text-slate-500 mb-8">
          Redirecting to home in {countdown} seconds...
        </p>

        {transaction && (
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Order Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Transaction ID</span>
                <span className="font-semibold text-slate-900">{transaction._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Amount Paid</span>
                <span className="font-semibold text-green-600">₹{transaction.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment Method</span>
                <span className="font-semibold text-slate-900">{transaction.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/user')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg"
          >
            <Home className="w-5 h-5" />
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-all"
          >
            <FileText className="w-5 h-5" />
            View Orders
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default PaymentSuccess
