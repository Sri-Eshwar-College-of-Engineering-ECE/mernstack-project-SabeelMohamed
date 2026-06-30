import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report
import joblib
import os

print("IntrusionX - Training Model")
print("=" * 50)

np.random.seed(42)
n = 20000

print("\nGenerating dataset...")
df = pd.concat([
    pd.DataFrame({
        'packet_size': np.random.normal(500, 150, n//2),
        'packet_rate': np.random.normal(50, 15, n//2),
        'protocol': np.random.choice([6, 17], n//2),
        'port': np.random.choice([80, 443, 22], n//2),
        'connection_duration': np.random.exponential(30, n//2),
        'bytes_sent': np.random.normal(1000, 300, n//2),
        'bytes_received': np.random.normal(2000, 500, n//2),
        'attack_type': 0
    }),
    pd.DataFrame({
        'packet_size': np.random.normal(800, 200, n//5),
        'packet_rate': np.random.normal(100, 30, n//5),
        'protocol': np.random.choice([6, 17, 1], n//5),
        'port': np.random.choice([80, 8080], n//5),
        'connection_duration': np.random.exponential(10, n//5),
        'bytes_sent': np.random.normal(2000, 500, n//5),
        'bytes_received': np.random.normal(1000, 300, n//5),
        'attack_type': 1
    }),
    pd.DataFrame({
        'packet_size': np.random.normal(1200, 300, n//5),
        'packet_rate': np.random.normal(150, 40, n//5),
        'protocol': np.random.choice([6, 17], n//5),
        'port': np.random.choice([135, 445], n//5),
        'connection_duration': np.random.exponential(5, n//5),
        'bytes_sent': np.random.normal(4000, 1000, n//5),
        'bytes_received': np.random.normal(500, 200, n//5),
        'attack_type': 2
    }),
    pd.DataFrame({
        'packet_size': np.random.normal(1500, 400, n//10),
        'packet_rate': np.random.normal(250, 60, n//10),
        'protocol': np.random.choice([1, 6], n//10),
        'port': np.random.choice([0, 445], n//10),
        'connection_duration': np.random.exponential(2, n//10),
        'bytes_sent': np.random.normal(8000, 2000, n//10),
        'bytes_received': np.random.normal(200, 100, n//10),
        'attack_type': 3
    })
]).sample(frac=1).reset_index(drop=True)

print(f"Dataset: {len(df)} samples")


X = df.drop('attack_type', axis=1)
y = df['attack_type']

print("\nSplitting and scaling...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

print("\nTraining Random Forest...")
model = RandomForestClassifier(n_estimators=200, max_depth=20, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

print(f"\nAccuracy: {model.score(X_test, y_test):.2%}")
print("\nClassification Report:")
print(classification_report(y_test, model.predict(X_test), target_names=['Normal', 'Low', 'Mid', 'Severe']))

os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/intrusion_model.pkl')
joblib.dump(scaler, 'models/scaler.pkl')

print("\nModel saved to models/")
print("=" * 50)
