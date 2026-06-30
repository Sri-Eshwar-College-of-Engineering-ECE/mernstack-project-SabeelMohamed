# IntrusionX Backend

Node.js/Express backend for IntrusionX network intrusion detection and mitigation system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Alerts
- `POST /api/alerts/create` - Create new alert (from ML service)
- `GET /api/alerts` - Get user alerts (requires auth)
- `GET /api/alerts/stats` - Get alert statistics (requires auth)
Alerts now store a mitigation action and block signature for severe detections.

### Monitoring
- `POST /api/monitoring/start` - Start network monitoring (requires auth)
- `POST /api/monitoring/stop` - Stop network monitoring (requires auth)
- `GET /api/monitoring/status` - Get monitoring status (requires auth)
- `GET /api/monitoring/stats` - Get network statistics (requires auth)
- `GET /api/monitoring/blocklist` - Get blocked signatures (requires auth)
- `GET /api/monitoring/history` - Get monitoring history (requires auth)

### Health
- `GET /api/health` - Health check

## WebSocket Events

- `connection` - Client connects
- `subscribe` - Subscribe to user-specific alerts
- `disconnect` - Client disconnects

## Port

Default: 5000
