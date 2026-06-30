# SmartVend - IoT Vending Machine Frontend

A modern, professional React landing page for an IoT-based vending machine system.

## Features

- **Modern UI**: Built with React, TailwindCSS, and Framer Motion
- **Responsive Design**: Works seamlessly on all devices
- **Professional Animations**: Smooth transitions and interactions
- **Icons**: Lucide React icons for a clean look

## Tech Stack

- React 18
- Vite
- TailwindCSS
- Framer Motion
- Lucide React

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Payment Integration

- **Online**: Razorpay integration (to be implemented)
- **Offline**: OTP-based QR code system with ESP32

## Next Steps

1. Integrate Razorpay payment gateway
2. Create mobile app for OTP generation
3. Connect to ESP32 backend API
4. Add user authentication
