require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const authRoutes = require('./routes/auth');
const alertRoutes = require('./routes/alerts');
const monitoringRoutes = require('./routes/monitoring');
const predictionRoutes = require('./routes/predictions');

const configuredOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const allowAllOrigins = configuredOrigins.includes('*');

const corsOptions = {
  origin: (origin, callback) => {
    if (allowAllOrigins || !origin || configuredOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
};

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: allowAllOrigins ? '*' : configuredOrigins,
    methods: ['GET', 'POST']
  }
});

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('✗ MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/predictions', predictionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'IntrusionX Backend'
  });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('subscribe', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} subscribed to alerts`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('IntrusionX Backend Server');
  console.log('='.repeat(50));
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ API: http://localhost:${PORT}/api`);
  console.log(`✓ WebSocket: ws://localhost:${PORT}`);
  console.log('='.repeat(50));
});

global.io = io;

module.exports = { app, io };
