import React from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Wifi, QrCode, Zap, Database, Shield, Bell, Lightbulb, Camera, DoorOpen, Settings } from 'lucide-react'
import vendingMachineImage from '../../assets/image.png'

const Hero = () => {
  return (
    <>
    <section className="relative pt-20 md:pt-24 pb-12 md:pb-16 bg-gradient-to-br from-slate-50 to-white">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              <span className="text-slate-900">Smart Vending</span>
              <br />
              <span className="text-blue-900">Machine</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-700 mb-3 md:mb-4 leading-relaxed">
              A revolutionary vending platform integrating online and offline payment mechanisms for automated retail. Built on ESP32 microcontroller and RTC, ensuring reliable dispensing without network connectivity.
            </p>
            
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              Standout feature: Offline payment capability with time-based OTP via QR code. Users scan, enter OTP, get instant dispensing. Payment automatically triggers through Razorpay when connectivity restores.
            </p>
          </motion.div>

          {/* Right Content - Vending Machine Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex items-center justify-center lg:justify-end mt-8 md:mt-0"
          >
            <div className="relative w-full max-w-md bg-gradient-to-br from-slate-50 to-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100">
              {/* Decorative background shapes - hidden on mobile */}
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-3xl hidden md:block"></div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-red-500 rounded-full opacity-10 blur-3xl hidden md:block"></div>
              
              <motion.img 
                src={vendingMachineImage}
                alt="Smart Vending Machine"
                className="relative w-full h-auto object-contain drop-shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  )
}

export default Hero
