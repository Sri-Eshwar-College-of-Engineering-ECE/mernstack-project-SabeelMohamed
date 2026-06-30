# IntrusionX - ML Component

Real-time network intrusion detection using Machine Learning.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Train the ML model:
```bash
python train_model.py
```

3. Start the monitoring service:
```bash
python monitor.py
```

## Features

- Real-time packet capture and analysis
- Random Forest classifier for intrusion detection
- 4 severity levels: Normal, Low, Mid, Severe
- REST API for monitoring control
- Live statistics and detection history

## API Endpoints

- `POST /api/ml/start` - Start monitoring
- `POST /api/ml/stop` - Stop monitoring
- `GET /api/ml/status` - Get monitoring status
- `GET /api/ml/stats` - Get detailed statistics
- `GET /api/ml/health` - Health check

## Model Details

- Algorithm: Random Forest Classifier
- Features: 7 (packet_size, packet_rate, protocol, port, connection_duration, bytes_sent, bytes_received)
- Classes: 4 (Normal=0, Low=1, Mid=2, Severe=3)
- Training samples: 20,000 synthetic network packets

## Note

Run with administrator/root privileges for packet capture:
- Windows: Run as Administrator
- Linux/Mac: Use sudo
