import React from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Smartphone, Clock, Shield, Wifi, QrCode, Database, Zap } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: QrCode,
      title: 'Offline OTP System',
      description: 'ESP32+RTC generates time-based OTP displayed as QR code. Scan with mobile app, manually enter OTP, and get instant product dispensing—no internet required.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Zap,
      title: 'Auto-Deferred Payment',
      description: 'Mobile app monitors network status and automatically triggers Razorpay payment when connectivity is restored after offline purchase.',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      icon: CreditCard,
      title: 'Razorpay Integration',
      description: 'Instant online payments via UPI, cards, and net banking. Secure, fast, and hassle-free checkout experience.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Database,
      title: 'Firebase Sync',
      description: 'Real-time data synchronization between vending machines, web platform, and mobile app ensures consistent inventory and order tracking.',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      icon: Wifi,
      title: 'ESP32 IoT Core',
      description: 'Powered by ESP32 microcontroller with RTC module for reliable offline operation, time-based security, and seamless IoT connectivity.',
      color: 'from-blue-400 to-blue-500',
    },
    {
      icon: Shield,
      title: 'JWT Authentication',
      description: 'Secure user authentication with JSON Web Tokens, bcrypt password hashing, and role-based access control for admin dashboard.',
      color: 'from-sky-500 to-sky-600',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="features" className="py-12 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16"
        >
          <div className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 bg-blue-100 text-blue-900 rounded-full mb-3 md:mb-4 shadow-md border-2 border-blue-200">
            <span className="text-xs md:text-sm font-semibold uppercase tracking-wide">Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4 px-4">
            <span className="text-blue-900">Revolutionary</span> Features
          </h2>
          <p className="text-base md:text-xl text-slate-700 max-w-2xl mx-auto px-4">
            Full-stack IoT solution with unique offline capabilities and automatic payment synchronization
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-blue-600 group cursor-pointer overflow-hidden relative"
              >
                {/* Hover Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Icon */}
                <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl bg-blue-100 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-all duration-300 shadow-md`}>
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
                </div>

                {/* Content */}
                <h3 className="relative text-lg md:text-xl font-bold text-blue-900 mb-2 md:mb-3 transition-colors">
                  {feature.title}
                </h3>
                <p className="relative text-sm md:text-base text-slate-700 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Features
