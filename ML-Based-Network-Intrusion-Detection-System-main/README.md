# IntrusionX - Real-Time Network Intrusion Detection System

A complete AI-powered network security monitoring system with real-time threat detection, automated mitigation, multi-level alerts, and live analytics dashboard.

## 🎯 Features

### Core Functionality
- **Real-Time Monitoring**: Continuous network packet capture and analysis
- **AI-Powered Detection**: Machine Learning model with 99.52% accuracy
- **4-Level Threat Classification**: Normal, Low, Mid, Severe
- **Multi-Level Alerts and Prevention**:
  - Low: Dashboard notification only
  - Mid: Dashboard + Email alert
  - Severe: Dashboard + SMS alert + signature block
- **Live Analytics**: Real-time charts and statistics
- **Alert History**: Complete audit trail of all detections
- **Blocked Attempt Tracking**: Separate counter for prevented attacks

### Technical Features
- Random Forest ML model trained on 20,000 samples
- Real-time packet capture using Scapy
- MongoDB database for persistent storage
- JWT-based authentication
- WebSocket for real-time updates
- Email notifications via Gmail
- SMS notifications via Twilio
- Responsive React dashboard

## 📁 Project Structure

```
intrusionx/
├── ml/                      # Machine Learning Service
│   ├── models/             # Trained ML models
│   ├── train.py           # Model training script
│   ├── monitor.py         # Real-time monitoring service
│   ├── test_model.py      # Model testing
│   └── requirements.txt   # Python dependencies
│
├── backend/                # Node.js Backend API
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── utils/             # Notification utilities
│   ├── server.js          # Express server
│   └── package.json       # Node dependencies
│
└── frontend/              # React Frontend
    ├── src/
    │   ├── pages/        # Page components
    │   ├── App.js        # Main app component
    │   └── index.js      # Entry point
    └── package.json      # React dependencies
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.12+
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account (for email alerts)
- Twilio account (for SMS alerts)
- Npcap (for Windows packet capture)

### 1. ML Service Setup

```bash
cd ml

# Install dependencies
pip install -r requirements.txt

# Train the model
python train.py

# Test the model
python test_model.py

# Start monitoring service (requires admin/root)
python monitor.py
```

The ML service will run on `http://localhost:5001`

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure .env file with your credentials
# MONGODB_URI, EMAIL_USER, EMAIL_APP_PASSWORD, TWILIO credentials

# Start server
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will run on `http://localhost:3000`

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_gmail@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
JWT_SECRET=your_secret_key
PORT=5000
ML_SERVICE_URL=http://localhost:5001
```

### Gmail App Password Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account > Security > App Passwords
3. Generate a new app password for "Mail"
4. Use this password in EMAIL_APP_PASSWORD

### Twilio Setup
1. Sign up at https://www.twilio.com
2. Get your Account SID and Auth Token
3. Get a Twilio phone number
4. Add these to your .env file

## 📊 Usage

### 1. Create Account
- Navigate to `http://localhost:3000`
- Click "Get Started" or "Sign Up"
- Enter email, phone number, and password
- Phone number format: +1234567890 (with country code)

### 2. Start Monitoring
- Log in to your account
- Click "Start Monitoring" button
- The system will begin capturing and analyzing network packets
- Dashboard updates every 3 seconds with live data

### 3. View Analytics
- **Statistics Cards**: Total packets, normal traffic, threats by severity
- **Traffic Trend Chart**: Line graph showing threats vs normal traffic over time
- **Distribution Chart**: Pie chart of traffic breakdown
- **Live Detections**: Real-time list of recent packet classifications
- **Alert History**: Complete log of all alerts with timestamps

### 4. Receive Alerts
- **Low Threats**: Visible in dashboard only
- **Mid Threats**: Email sent to registered email address
- **Severe Threats**: SMS sent to registered phone number

## 🔒 Security Notes

### Running with Required Permissions

**Windows:**
- Right-click Command Prompt/PowerShell
- Select "Run as Administrator"
- Navigate to ml folder and run `python monitor.py`

**Linux/Mac:**
```bash
sudo python monitor.py
```

### Why Admin/Root Access?
Packet capture requires low-level network access, which needs elevated privileges.

## 🧪 Testing

### Test ML Model
```bash
cd ml
python test_model.py
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Check ML service
curl http://localhost:5001/api/ml/health
```

## 📈 Model Performance

- **Algorithm**: Random Forest Classifier
- **Training Samples**: 20,000
- **Features**: 7 (packet_size, packet_rate, protocol, port, connection_duration, bytes_sent, bytes_received)
- **Accuracy**: 99.52%
- **Classes**: 4 (Normal, Low, Mid, Severe)

### Classification Report
```
              precision    recall  f1-score   support
Normal          1.00      1.00      1.00      1971
Low             0.99      0.99      0.99       824
Mid             0.99      1.00      1.00       802
Severe          1.00      0.98      0.99       403
```

## 🛠️ Troubleshooting

### ML Service Issues
- **"Model not found"**: Run `python train.py` first
- **"Permission denied"**: Run with admin/root privileges
- **"Npcap not found"**: Install Npcap from https://npcap.com

### Backend Issues
- **MongoDB connection failed**: Check MONGODB_URI in .env
- **Email not sending**: Verify Gmail app password
- **SMS not sending**: Check Twilio credentials

### Frontend Issues
- **CORS errors**: Ensure backend is running on port 5000
- **Authentication failed**: Check JWT_SECRET matches in backend
- **Charts not showing**: Ensure recharts is installed

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Monitoring
- `POST /api/monitoring/start` - Start monitoring (requires auth)
- `POST /api/monitoring/stop` - Stop monitoring (requires auth)
- `GET /api/monitoring/status` - Get status (requires auth)
- `GET /api/monitoring/stats` - Get statistics (requires auth)
- `GET /api/monitoring/blocklist` - Get blocked signatures (requires auth)

### Alerts
- `GET /api/alerts` - Get user alerts (requires auth)
- `GET /api/alerts/stats` - Get alert statistics (requires auth)
- `POST /api/alerts/create` - Create alert (internal)

Severe alerts now also persist a mitigation action so the monitoring service can block repeated signatures.

### ML Service
- `POST /api/ml/start` - Start packet capture
- `POST /api/ml/stop` - Stop packet capture
- `GET /api/ml/status` - Get monitoring status
- `GET /api/ml/stats` - Get network statistics
- `GET /api/ml/health` - Health check

## 📝 License

This project is for educational purposes.

## 👥 Support

For issues or questions, please check the troubleshooting section or review the code documentation.

## 🎓 Technologies Used

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Socket.io
- Nodemailer
- Twilio

### Frontend
- React 18
- React Router
- Axios
- Recharts
- CSS3

### ML/AI
- Python 3.12
- Scikit-learn
- Pandas & NumPy
- Scapy
- Flask
- Joblib

## 🚀 Production Deployment

For production deployment:
1. Use environment variables for all sensitive data
2. Enable HTTPS/SSL
3. Use production WSGI server (Gunicorn) for Flask
4. Use PM2 or similar for Node.js
5. Set up proper firewall rules
6. Use production MongoDB cluster
7. Implement rate limiting
8. Add logging and monitoring
9. Regular security audits

---

**Built with ❤️ for Network Security**
