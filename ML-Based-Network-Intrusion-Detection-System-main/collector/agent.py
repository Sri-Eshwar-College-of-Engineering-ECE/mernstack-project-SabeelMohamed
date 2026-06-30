import os
import time
from collections import deque

import requests
from scapy.all import IP, TCP, UDP, sniff

ML_API_URL = os.getenv("ML_API_URL", "http://localhost:5001/api/ml/predict")
BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://localhost:5000/api/predictions")
COLLECTOR_API_KEY = os.getenv("COLLECTOR_API_KEY", "")
SNIFF_INTERFACE = os.getenv("SNIFF_INTERFACE")
REQUEST_TIMEOUT = float(os.getenv("REQUEST_TIMEOUT", "5"))

recent_sizes = deque(maxlen=25)
recent_timestamps = deque(maxlen=25)


def packet_rate_per_sec(now_ts):
    while recent_timestamps and now_ts - recent_timestamps[0] > 1.0:
        recent_timestamps.popleft()
    return len(recent_timestamps)


def extract_features(packet):
    now_ts = time.time()
    packet_size = len(packet)
    recent_sizes.append(packet_size)
    recent_timestamps.append(now_ts)

    protocol = 0
    if packet.haslayer(TCP):
        protocol = 6
    elif packet.haslayer(UDP):
        protocol = 17
    elif packet.haslayer(IP):
        protocol = int(packet[IP].proto)

    port = 0
    if packet.haslayer(TCP):
        port = int(packet[TCP].dport)
    elif packet.haslayer(UDP):
        port = int(packet[UDP].dport)

    packet_rate = packet_rate_per_sec(now_ts)
    avg_packet_size = sum(recent_sizes) / max(len(recent_sizes), 1)

    # Approximate connection values for a generic collector pipeline.
    connection_duration = 1.0
    bytes_sent = float(packet_size)
    bytes_received = float(avg_packet_size)

    return [
        float(packet_size),
        float(packet_rate),
        float(protocol),
        float(port),
        float(connection_duration),
        float(bytes_sent),
        float(bytes_received),
    ]


def send_prediction_to_backend(features, prediction_response):
    headers = {"Content-Type": "application/json"}
    if COLLECTOR_API_KEY:
        headers["x-api-key"] = COLLECTOR_API_KEY

    payload = {
        "source": "collector",
        "features": features,
        "prediction": prediction_response.get("prediction", 0),
        "predictionLabel": prediction_response.get("prediction_label", "Unknown"),
        "confidence": prediction_response.get("confidence", 0.0),
        "metadata": {
            "collectorTs": time.time()
        },
    }

    backend_response = requests.post(
        BACKEND_API_URL,
        json=payload,
        headers=headers,
        timeout=REQUEST_TIMEOUT,
    )
    backend_response.raise_for_status()
    return backend_response


def process_packet(packet):
    try:
        features = extract_features(packet)

        ml_response = requests.post(
            ML_API_URL,
            json={"features": features},
            timeout=REQUEST_TIMEOUT,
        )
        ml_response.raise_for_status()
        prediction_data = ml_response.json()

        backend_response = send_prediction_to_backend(features, prediction_data)

        print(
            f"Prediction={prediction_data.get('prediction')} "
            f"Label={prediction_data.get('prediction_label')} "
            f"Confidence={prediction_data.get('confidence')} "
            f"SavedStatus={backend_response.status_code}"
        )
    except requests.HTTPError as error:
        response = error.response
        status = response.status_code if response is not None else "N/A"
        text = response.text if response is not None else str(error)
        print(f"Collector HTTP error: status={status} detail={text}")
    except requests.RequestException as error:
        print(f"Collector request error: {error}")
    except Exception as error:
        print(f"Collector error: {error}")


def start_collector():
    print("=" * 60)
    print("IntrusionX Packet Collector")
    print("=" * 60)
    print(f"ML API: {ML_API_URL}")
    print(f"Backend API: {BACKEND_API_URL}")
    print("Starting packet sniffing...")

    sniff(prn=process_packet, store=0, iface=SNIFF_INTERFACE)


if __name__ == "__main__":
    start_collector()
