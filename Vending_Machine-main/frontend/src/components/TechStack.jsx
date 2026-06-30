import React from 'react'
import { motion } from 'framer-motion'
import { Code2, Server, Smartphone, Cpu, Database, Shield } from 'lucide-react'

const TechStack = () => {
  const techCategories = [
    {
      icon: Code2,
      title: 'Frontend',
      color: 'from-blue-500 to-blue-600',
      technologies: [
        'React with Vite',
        'Material-UI & React Bootstrap',
        'React Router',
        'Chart.js (Analytics)',
        'Emotion (Styling)',
        'Razorpay SDK'
      ]
    },
    {
      icon: Server,
      title: 'Backend',
      color: 'from-emerald-500 to-emerald-600',
      technologies: [
        'Node.js & Express',
        'MongoDB with Mongoose',
        'JWT Authentication',
        'bcryptjs (Hashing)',
        'Multer (File Uploads)',
        'RESTful API'
      ]
    },
    {
      icon: Cpu,
      title: 'IoT Hardware',
      color: 'from-violet-500 to-violet-600',
      technologies: [
        'ESP32 Dev Kit',
        'RTC Module',
        'Time-Based OTP',
        'QR Code Display',
        'Product Dispenser',
        'Local Verification'
      ]
    },
    {
      icon: Smartphone,
      title: 'Mobile App',
      color: 'from-indigo-500 to-indigo-600',
      technologies: [
        'Custom Android App',
        'QR Scanner',
        'Network Monitor',
        'Auto Payment Trigger',
        'Razorpay Integration',
        'Offline Support'
      ]
    },
    {
      icon: Database,
      title: 'Data & Sync',
      color: 'from-cyan-500 to-cyan-600',
      technologies: [
        'Firebase Realtime DB',
        'MongoDB Atlas',
        'Real-Time Sync',
        'Offline Data Queue',
        'Transaction Logs',
        'Inventory Tracking'
      ]
    },
    {
      icon: Shield,
      title: 'Security',
      color: 'from-purple-500 to-purple-600',
      technologies: [
        'JWT Tokens',
        'bcrypt Hashing',
        'Time-Based OTP',
        'Secure Payment Gateway',
        'Role-Based Access',
        'HTTPS/SSL'
      ]
    }
  ]

  return (
    <section className="py-24 bg-white">
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
            <span className="text-sm font-semibold text-blue-700">TECHNOLOGY STACK</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Built with Modern Tech
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A comprehensive full-stack solution leveraging cutting-edge technologies for reliability and scalability
          </p>
        </motion.div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-2xl hover:border-blue-300 hover:bg-white transition-all group"
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors">
                  {category.title}
                </h3>

                {/* Technologies List */}
                <ul className="space-y-2">
                  {category.technologies.map((tech, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-slate-600 leading-relaxed">{tech}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TechStack
