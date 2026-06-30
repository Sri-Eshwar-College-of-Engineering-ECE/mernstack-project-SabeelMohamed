import joblib
import numpy as np

print("Testing SHAP Integration")
print("=" * 50)

try:
    # Load model and SHAP explainer
    model = joblib.load('models/intrusion_model.pkl')
    scaler = joblib.load('models/scaler.pkl')
    print("✓ Model loaded")
    
    try:
        explainer = joblib.load('models/shap_explainer.pkl')
        feature_names = joblib.load('models/feature_names.pkl')
        print("✓ SHAP explainer loaded")
        
        # Test prediction with explanation
        test_features = np.array([[1200, 150, 6, 445, 5, 4000, 500]])
        scaled_features = scaler.transform(test_features)
        
        prediction = model.predict(scaled_features)[0]
        confidence = model.predict_proba(scaled_features)[0]
        
        print(f"\nTest Prediction:")
        print(f"  Class: {['Normal', 'Low', 'Mid', 'Severe'][int(prediction)]}")
        print(f"  Confidence: {confidence[int(prediction)]:.2%}")
        
        # Get SHAP values
        shap_values = explainer.shap_values(scaled_features)
        
        # Debug: Check structure
        print(f"\nSHAP values type: {type(shap_values)}")
        if isinstance(shap_values, list):
            print(f"SHAP values is a list with {len(shap_values)} elements")
            print(f"Each element shape: {shap_values[0].shape if len(shap_values) > 0 else 'N/A'}")
        else:
            print(f"SHAP values shape: {shap_values.shape}")
        
        print(f"\nSHAP Feature Importance:")
        feature_impacts = []
        
        # SHAP values shape is (samples, features, classes)
        # We want features for the predicted class
        class_shap_values = shap_values[0, :, int(prediction)]  # Get features for predicted class
        
        for i, name in enumerate(feature_names):
            impact = float(class_shap_values[i])
            feature_impacts.append((name, impact, test_features[0][i]))
        
        # Sort by absolute impact
        feature_impacts.sort(key=lambda x: abs(x[1]), reverse=True)
        
        for name, impact, value in feature_impacts:
            direction = "↑" if impact > 0 else "↓"
            print(f"  {name}: {value:.2f} {direction} (impact: {impact:.4f})")
        
        print("\n✓ SHAP integration working correctly!")
        
    except FileNotFoundError:
        print("\n⚠ SHAP explainer not found")
        print("Run 'python train_with_shap.py' to create it")
        
except Exception as e:
    import traceback
    print(f"\n✗ Error: {e}")
    traceback.print_exc()

print("=" * 50)
