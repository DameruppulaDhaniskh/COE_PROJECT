"""
Retrain the credit default model using only 10 selected features.
Saves updated credit_model.pkl and model_columns.pkl to ../models/
"""

import os
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

# ── Paths ───────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "..", "default of credit card clients.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")

# ── Selected features ──────────────────────────────────────────────
SELECTED_FEATURES = [
    "LIMIT_BAL", "AGE",
    "PAY_1", "PAY_2", "PAY_3",
    "BILL_AMT1", "PAY_AMT1", "PAY_AMT2",
]

TARGET = "dpnm"

# ── Load data ──────────────────────────────────────────────────────
print(f"Loading data from {DATA_PATH}")
df = pd.read_csv(DATA_PATH)

# Some versions of the dataset use 'default.payment.next.month' or similar
if TARGET not in df.columns:
    # Try other common names
    for col in df.columns:
        if "default" in col.lower():
            TARGET = col
            break

# Handle PAY_0 → PAY_1 column name mismatch (UCI dataset uses PAY_0)
if "PAY_0" in df.columns and "PAY_1" not in df.columns:
    df.rename(columns={"PAY_0": "PAY_1"}, inplace=True)

print(f"Dataset shape: {df.shape}")
print(f"Target column: {TARGET}")
print(f"Selected features: {SELECTED_FEATURES}")

X = df[SELECTED_FEATURES]
y = df[TARGET]

# ── Train / test split ─────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── Train Random Forest ────────────────────────────────────────────
print("\nTraining Random Forest...")
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    n_jobs=-1,
)
model.fit(X_train, y_train)

# ── Evaluate ───────────────────────────────────────────────────────
y_pred = model.predict(X_test)
print(f"\nAccuracy: {accuracy_score(y_test, y_pred):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# ── Save model and columns ─────────────────────────────────────────
os.makedirs(MODEL_DIR, exist_ok=True)

model_path = os.path.join(MODEL_DIR, "credit_model.pkl")
columns_path = os.path.join(MODEL_DIR, "model_columns.pkl")

joblib.dump(model, model_path)
joblib.dump(SELECTED_FEATURES, columns_path)

print(f"\nModel saved to {model_path}")
print(f"Columns saved to {columns_path}")
print(f"Model columns: {SELECTED_FEATURES}")
