from collections import deque
from threading import Lock
from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import numpy as np
import os
import time

app = Flask(__name__)

cors_origin = os.getenv("CORS_ORIGIN", "*")
if cors_origin == "*":
    CORS(app)
else:
    origins = [o.strip() for o in cors_origin.split(",") if o.strip()]
    CORS(app, resources={r"/*": {"origins": origins}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

model = None
scaler = None
shap_explainer = None
feature_names = None
load_error = None
state_lock = Lock()
recent_detections = deque(maxlen=200)
network_stats = {
    "total_packets": 0,
    "normal_packets": 0,
    "low_attacks": 0,
    "mid_attacks": 0,
    "severe_attacks": 0,
    "blocked_packets": 0,
    "monitoring": False,
    "start_time": None,
}


def _model_path(file_name):
    return os.path.join(MODELS_DIR, file_name)


def load_model():
    global model, scaler, shap_explainer, feature_names, load_error
    try:
        model = joblib.load(_model_path("intrusion_model.pkl"))
        scaler = joblib.load(_model_path("scaler.pkl"))
        print("Model loaded successfully")
        load_error = None

        try:
            shap_explainer = joblib.load(_model_path("shap_explainer.pkl"))
            feature_names = joblib.load(_model_path("feature_names.pkl"))
            print("SHAP explainer loaded")
        except Exception:
            shap_explainer = None
            feature_names = None
            print("SHAP explainer not available")

        return True
    except Exception as error:
        load_error = str(error)
        print(f"Error loading model: {error}")
        return False


def _normalize_features(payload):
    data = payload.get("features", payload)

    if isinstance(data, dict):
        ordered = [
            data.get("packet_size", 500),
            data.get("packet_rate", 50),
            data.get("protocol", 6),
            data.get("port", 80),
            data.get("connection_duration", 30),
            data.get("bytes_sent", 1000),
            data.get("bytes_received", 2000),
        ]
        return [float(v) for v in ordered]

    if isinstance(data, list) and len(data) == 7:
        return [float(v) for v in data]

    raise ValueError("features must be a list of 7 values or a feature object")


def predict_intrusion(feature_values):
    if model is None or scaler is None:
        raise RuntimeError("Model not loaded")

    feature_array = np.array([feature_values])
    scaled_features = scaler.transform(feature_array)
    prediction = int(model.predict(scaled_features)[0])
    probability = model.predict_proba(scaled_features)[0]
    confidence = float(max(probability))
    return prediction, confidence


def _prediction_label(prediction):
    return ["Normal", "Low", "Mid", "Severe"][prediction]


def _update_stats(prediction):
    network_stats["total_packets"] += 1
    if prediction == 0:
        network_stats["normal_packets"] += 1
    elif prediction == 1:
        network_stats["low_attacks"] += 1
    elif prediction == 2:
        network_stats["mid_attacks"] += 1
    elif prediction == 3:
        network_stats["severe_attacks"] += 1


@app.route("/api/ml/start", methods=["POST"])
def start_monitoring():
    with state_lock:
        if not network_stats["start_time"]:
            network_stats["start_time"] = time.time()
        network_stats["monitoring"] = True

    return jsonify({"message": "Monitoring enabled", "status": "running"})


@app.route("/api/ml/stop", methods=["POST"])
def stop_monitoring_route():
    with state_lock:
        network_stats["monitoring"] = False

    return jsonify({"message": "Monitoring disabled", "status": "stopped"})


@app.route("/api/ml/predict", methods=["POST"])
def predict_route():
    global model
    payload = request.get_json(silent=True) or {}

    if model is None and not load_model():
        return jsonify({"error": "Model not available"}), 500

    try:
        feature_values = _normalize_features(payload)
        prediction, confidence = predict_intrusion(feature_values)

        detection = {
            "timestamp": time.time(),
            "attack_type": prediction,
            "confidence": confidence,
            "packet_size": feature_values[0],
            "protocol": feature_values[2],
            "port": feature_values[3],
            "blocked": False,
        }

        with state_lock:
            if not network_stats["start_time"]:
                network_stats["start_time"] = time.time()
            network_stats["monitoring"] = True
            _update_stats(prediction)
            recent_detections.append(detection)

        return jsonify(
            {
                "prediction": prediction,
                "prediction_label": _prediction_label(prediction),
                "confidence": confidence,
                "features": feature_values,
            }
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    except Exception as error:
        return jsonify({"error": f"Prediction failed: {error}"}), 500


@app.route("/api/ml/status", methods=["GET"])
def get_monitoring_status():
    with state_lock:
        uptime = 0
        if network_stats["start_time"]:
            uptime = int(time.time() - network_stats["start_time"])

        return jsonify(
            {
                "monitoring": network_stats["monitoring"],
                "stats": network_stats,
                "uptime": uptime,
                "recent_detections": list(recent_detections)[-20:],
            }
        )


@app.route("/api/ml/stats", methods=["GET"])
def get_network_stats():
    with state_lock:
        return jsonify(
            {
                "network_stats": network_stats,
                "recent_detections": list(recent_detections)[-50:],
            }
        )


@app.route("/api/ml/health", methods=["GET"])
def health_check():
    return jsonify(
        {
            "status": "healthy",
            "model_loaded": model is not None,
            "monitoring": network_stats["monitoring"],
            "load_error": load_error,
        }
    )


@app.route("/api/ml/explain", methods=["POST"])
def explain_prediction():
    if shap_explainer is None or feature_names is None:
        return (
            jsonify(
                {
                    "error": "SHAP explainer not available",
                    "message": "Train model with train_with_shap.py to enable explanations",
                }
            ),
            404,
        )

    if model is None and not load_model():
        return jsonify({"error": "Model not available"}), 500

    try:
        payload = request.get_json(silent=True) or {}
        features = _normalize_features(payload)

        feature_array = np.array([features])
        scaled_features = scaler.transform(feature_array)
        prediction = model.predict(scaled_features)[0]
        confidence = model.predict_proba(scaled_features)[0]

        shap_values = shap_explainer.shap_values(scaled_features)
        class_shap_values = shap_values[0, :, int(prediction)]

        explanation = {}
        for idx, name in enumerate(feature_names):
            explanation[name] = {
                "value": features[idx],
                "shap_impact": float(class_shap_values[idx]),
            }

        sorted_features = sorted(
            explanation.items(), key=lambda item: abs(item[1]["shap_impact"]), reverse=True
        )

        return jsonify(
            {
                "prediction": int(prediction),
                "prediction_label": _prediction_label(int(prediction)),
                "confidence": float(confidence[int(prediction)]),
                "explanation": dict(sorted_features[:5]),
                "top_feature": sorted_features[0][0] if sorted_features else None,
            }
        )
    except Exception as error:
        return jsonify({"error": str(error)}), 500


load_model()


if __name__ == "__main__":
    print("=" * 60)
    print("IntrusionX - ML API Service")
    print("=" * 60)
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False, threaded=True)
