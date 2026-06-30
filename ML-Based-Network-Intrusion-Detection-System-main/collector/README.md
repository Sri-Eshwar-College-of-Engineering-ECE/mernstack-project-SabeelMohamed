# IntrusionX Packet Collector

This collector runs on a host with admin/root access and streams packet features to the deployed ML and backend services.

## Setup

1. Install dependencies:

```bash
pip install scapy requests
```

2. Configure environment variables:

```bash
export ML_API_URL="https://your-ml-service.onrender.com/api/ml/predict"
export BACKEND_API_URL="https://your-backend-service.onrender.com/api/predictions"
export COLLECTOR_API_KEY="your-collector-key"
# optional interface name:
# export SNIFF_INTERFACE="eth0"
```

On Windows PowerShell:

```powershell
$env:ML_API_URL="https://your-ml-service.onrender.com/api/ml/predict"
$env:BACKEND_API_URL="https://your-backend-service.onrender.com/api/predictions"
$env:COLLECTOR_API_KEY="your-collector-key"
```

3. Run as administrator/root:

```bash
python agent.py
```

## Notes

- Packet capture requires elevated privileges.
- Keep this collector outside Render; Render should host only backend and ML APIs.
- Collector requests include the API key as an `x-api-key` header when `COLLECTOR_API_KEY` is set.
