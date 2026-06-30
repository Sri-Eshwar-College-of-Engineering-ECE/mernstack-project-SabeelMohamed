import React from 'react'
import { motion } from 'framer-motion'
import { WifiOff, QrCode, Smartphone, KeyRound, Package, Wifi, CreditCard, CheckCircle2, Shield, Zap } from 'lucide-react'

const OfflineWorkflow = () => {
  const offlineSteps = [
    {
      icon: WifiOff,
      title: 'No Internet Detected',
      description: 'Vending machine operates independently using ESP32 and RTC module',
      color: 'from-red-500 to-red-600',
      step: '1'
    },
    {
      icon: QrCode,
      title: 'QR Code Generated',
      description: 'ESP32+RTC creates time-based OTP displayed as QR code on machine screen',
      color: 'from-orange-500 to-orange-600',
      step: '2'
    },
    {
      icon: Smartphone,
      title: 'Scan with Mobile App',
      description: 'User scans QR code with custom mobile app, which displays the OTP',
      color: 'from-yellow-500 to-yellow-600',
      step: '3'
    },
    {
      icon: KeyRound,
      title: 'Manual OTP Entry',
      description: 'User manually enters the displayed OTP into the vending machine keypad',
      color: 'from-green-500 to-green-600',
      step: '4'
    },
    {
      icon: Package,
      title: 'Instant Dispensing',
      description: 'OTP verified locally, product dispensed immediately without internet',
      color: 'from-blue-500 to-blue-600',
      step: '5'
    },
    {
      icon: Wifi,
      title: 'Network Monitoring',
      description: 'Mobile app continuously monitors phone\'s network connectivity status',
      color: 'from-indigo-500 to-indigo-600',
      step: '6'
    },
    {
      icon: CreditCard,
      title: 'Auto Payment Trigger',
      description: 'When online, app automatically initiates Razorpay payment for offline purchase',
      color: 'from-violet-500 to-violet-600',
      step: '7'
    },
    {
      icon: CheckCircle2,
      title: 'Transaction Complete',
      description: 'Payment settled, Firebase syncs all data, order history updated',
      color: 'from-purple-500 to-purple-600',
      step: '8'
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-4 border border-blue-200">
            <span className="text-sm font-semibold text-blue-700">OFFLINE PAYMENT WORKFLOW</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Never Miss a Purchase
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our unique offline payment system ensures uninterrupted service even without internet connectivity, 
            with automatic payment synchronization when back online
          </p>
        </motion.div>

        {/* Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offlineSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 h-full border border-slate-200 hover:shadow-2xl hover:border-blue-300 transition-all group">
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-lg group-hover:scale-125 transition-transform">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-md`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 bg-white rounded-2xl p-10 border border-slate-200 shadow-xl"
        >
          <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Why This Matters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">100% Uptime</h4>
              <p className="text-slate-600">
                Service continuity guaranteed regardless of network conditions
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Secure & Reliable</h4>
              <p className="text-slate-600">
                Time-based OTP ensures security without requiring constant connectivity
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Auto Payment</h4>
              <p className="text-slate-600">
                Zero user intervention for payment settlement when back online
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default OfflineWorkflow
