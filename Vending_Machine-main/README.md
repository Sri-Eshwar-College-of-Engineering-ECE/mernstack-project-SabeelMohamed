# SmartVend IoT - Intelligent Vending Machine System

A full-stack IoT-powered vending machine management system with offline payment capabilities, built with ESP32, React, Node.js, and Firebase.

## 🚀 Features

- **Offline OTP System** - ESP32+RTC generates time-based OTP displayed as QR code
- **Auto-Deferred Payment** - Automatic Razorpay payment when connectivity restores
- **Real-time Inventory** - Firebase-powered synchronized inventory across devices
- **Dual Payment Modes** - Online (Razorpay) and Offline (OTP-based) payments
- **ESP32 IoT Core** - Reliable offline operation with RTC module
- **JWT Authentication** - Secure user authentication with role-based access

## 🏗️ Project Structure

```
Vending-Machine/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
└── ESP32_OLED_OTP_DISPLAY.ino  # ESP32 firmware
```

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB
- Firebase account
- ESP32 microcontroller
- Razorpay account

## 🛠️ Installation

### Frontend (Deployed on Vercel)

```bash
cd frontend
npm install
npm run dev  # Development
npm run build  # Production build
```

### Backend (Deployed on Render)

```bash
cd backend
npm install
npm start  # Production
npm run dev  # Development
```

### ESP32 Setup

1. Open `ESP32_OLED_OTP_DISPLAY.ino` in Arduino IDE
2. Install required libraries
3. Upload to ESP32
4. Configure WiFi credentials

## 🌐 Deployment

### Frontend - Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Deploy automatically on push

### Backend - Render

1. Create new Web Service in Render
2. Connect GitHub repository
3. Set root directory to `backend`
4. Configure environment variables:
   - `MONGODB_URI`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `JWT_SECRET`
5. Add Firebase config file manually

## 📝 Environment Variables

Create `.env` in backend:

```
MONGODB_URI=your_mongodb_uri
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
JWT_SECRET=your_jwt_secret
```

## 🎯 API Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin)
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment

## 📱 Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB, JWT
- **Hardware**: ESP32, RTC Module, OLED Display
- **Payment**: Razorpay Integration
- **Database**: MongoDB + Firebase

## 📄 License

This project is proprietary and confidential.

## 👥 Contributing

This is a private project. Contact maintainers for access.

