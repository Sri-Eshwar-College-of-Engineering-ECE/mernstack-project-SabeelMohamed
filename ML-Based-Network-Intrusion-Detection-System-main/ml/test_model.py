import joblib
import numpy as np

def test_model():
    """Test the trained model with sample data"""
    print("Loading model...")
    model = joblib.load('models/intrusion_model.pkl')
    scaler = joblib.load('models/scaler.pkl')
    
    # Test cases
    test_cases = [
        {
            'name': 'Normal HTTP Traffic',
            'features': [500, 50, 6, 80, 30, 1000, 2000]
        },
        {
            'name': 'Low Severity Attack',
            'features': [800, 100, 6, 8080, 10, 2000, 1000]
        },
        {
            'name': 'Mid Severity Attack',
            'features': [1200, 150, 6, 445, 5, 4000, 500]
        },
        {
            'name': 'Severe Attack',
            'features': [1500, 250, 1, 0, 2, 8000, 200]
        }
    ]
    
    severity_labels = ['Normal', 'Low', 'Mid', 'Severe']
    
    print("\n" + "=" * 60)
    print("Testing Model Predictions")
    print("=" * 60)
    
    for test in test_cases:
        features = np.array([test['features']])
        scaled = scaler.transform(features)
        prediction = model.predict(scaled)[0]
        probabilities = model.predict_proba(scaled)[0]
        
        print(f"\n{test['name']}:")
        print(f"  Prediction: {severity_labels[prediction]}")
        print(f"  Confidence: {max(probabilities):.2%}")
        print(f"  Probabilities: Normal={probabilities[0]:.2%}, Low={probabilities[1]:.2%}, Mid={probabilities[2]:.2%}, Severe={probabilities[3]:.2%}")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    test_model()
