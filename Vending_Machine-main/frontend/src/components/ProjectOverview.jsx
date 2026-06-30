import React from 'react'
import { motion } from 'framer-motion'
import { Layers, Users, BarChart3, Globe } from 'lucide-react'

const ProjectOverview = () => {
  const highlights = [
    {
      icon: Layers,
      title: 'Full-Stack Solution',
      description: 'Complete ecosystem with React frontend, Node.js backend, ESP32 hardware, and custom mobile app',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: Globe,
      title: 'Hybrid Connectivity',
      description: 'Seamless operation in both online and offline modes with automatic synchronization',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Multi-Platform Access',
      description: 'Web dashboard for admins, mobile app for customers, and IoT-enabled vending machines',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Chart.js powered dashboard with sales tracking, inventory management, and usage insights',
      color: 'from-cyan-500 to-cyan-600'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Full-Stack IoT-Enabled Vending Machine System
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            A revolutionary vending platform that seamlessly integrates <strong className="text-gray-900">robust online and offline payment mechanisms</strong> for automated retail. 
            The solution combines a hardware vending unit (built on <strong className="text-gray-900">ESP32 microcontroller and RTC</strong>) with a modern web-based platform 
            and a dedicated mobile application, ensuring <strong className="text-gray-900">reliable product dispensing even in the absence of network connectivity</strong>.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            The standout feature is the <strong className="text-indigo-600">offline payment capability</strong>, where the vending machine generates a time-based OTP displayed as a QR code. 
            Users scan it with the mobile app, manually enter the OTP, and receive instant product dispensing. The mobile app then automatically triggers 
            payment through Razorpay when connectivity is restored, completing the deferred payment process without user intervention.
          </p>
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl hover:border-emerald-400 transition-all group"
              >
                <div className="flex items-start space-x-5">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${highlight.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {highlight.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Core Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-10 border border-emerald-200"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            System Architecture
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
              <div className="text-4xl mb-3">🌐</div>
              <h4 className="font-bold text-slate-900 mb-2">Web Platform</h4>
              <p className="text-sm text-slate-600">React + Vite, Material-UI, Admin Dashboard, Chart.js Analytics</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
              <div className="text-4xl mb-3">⚙️</div>
              <h4 className="font-bold text-slate-900 mb-2">Backend API</h4>
              <p className="text-sm text-slate-600">Node.js + Express, MongoDB, JWT Auth, Razorpay Integration</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
              <div className="text-4xl mb-3">🤖</div>
              <h4 className="font-bold text-slate-900 mb-2">IoT + Mobile</h4>
              <p className="text-sm text-slate-600">ESP32 + RTC, Firebase Sync, Custom Android App, QR Scanner</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProjectOverview
