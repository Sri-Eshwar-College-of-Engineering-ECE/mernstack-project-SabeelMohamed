import React from 'react'
import { motion } from 'framer-motion'
import { Search, CreditCard, Package, CheckCircle } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Choose Your Item',
      description: 'Browse available products on the vending machine or through our mobile app.',
      step: '01',
    },
    {
      icon: CreditCard,
      title: 'Select Payment Method',
      description: 'Pay online using Razorpay or choose the offline OTP option for quick access.',
      step: '02',
    },
    {
      icon: Package,
      title: 'Scan QR Code',
      description: 'For offline mode, scan the QR code displayed on the machine with your app.',
      step: '03',
    },
    {
      icon: CheckCircle,
      title: 'Collect Your Item',
      description: 'Enter the OTP, verify, and collect your item. It\'s that simple!',
      step: '04',
    },
  ]

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-4 border border-blue-200">
            <span className="text-sm font-semibold text-blue-700">HOW IT WORKS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Simple & Seamless Process
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Experience hassle-free vending with both online and offline payment options
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="relative cursor-pointer"
              >
                <div className="bg-slate-50 rounded-2xl p-6 h-full border border-slate-200 hover:shadow-2xl hover:border-blue-300 hover:bg-white transition-all group">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white font-bold rounded-xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all shadow-lg">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                    <Icon className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-blue-50 rounded-2xl p-8 border border-blue-200"
        >
          <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Flexible Payment Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Online Payment */}
            <div className="flex items-start space-x-5 p-6 rounded-xl bg-white shadow-lg border border-slate-200 hover:border-blue-400 transition-all group">
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Online Payment</h4>
                <p className="text-slate-600 leading-relaxed mb-3">
                  Pay instantly through Razorpay with UPI, cards, or net banking. Fast, secure, and hassle-free.
                </p>
                <ul className="space-y-1 text-sm text-slate-500">
                  <li>• Instant confirmation</li>
                  <li>• Multiple payment options</li>
                  <li>• Secure transaction gateway</li>
                </ul>
              </div>
            </div>

            {/* Offline OTP */}
            <div className="flex items-start space-x-5 p-6 rounded-xl bg-white shadow-lg border border-slate-200 hover:border-blue-400 transition-all group">
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Offline OTP Payment</h4>
                <p className="text-slate-600 leading-relaxed mb-3">
                  Scan QR code with mobile app, manually enter OTP on machine, get instant product. Payment auto-settles when online.
                </p>
                <ul className="space-y-1 text-sm text-slate-500">
                  <li>• Works without internet</li>
                  <li>• Time-based OTP security</li>
                  <li>• Auto deferred payment</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks
