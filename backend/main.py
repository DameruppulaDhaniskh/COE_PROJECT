"""
Credit Card Default Risk Prediction — FastAPI Backend
=====================================================
• Loads a pre-trained Random Forest model on startup
• POST /predict  → run inference, store result, return risk level + probability
• GET  /history  → return all past predictions for the dashboard
"""

import os
import sys

# Ensure Vercel can resolve local modules like 'database' and 'schemas'
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import joblib
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import PredictionRecord
from schemas import CreditInput, PredictionResponse, HistoryItem

startup_error = None
model = None
model_columns = None

try:
    # ── Create tables (if they don't exist yet) ────────────────────────────────
    Base.metadata.create_all(bind=engine)

    # ── Load model artefacts ───────────────────────────────────────────────────
    MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")

    model_path = os.path.join(MODEL_DIR, "credit_model.pkl")
    columns_path = os.path.join(MODEL_DIR, "model_columns.pkl")

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}")
    if not os.path.exists(columns_path):
        raise FileNotFoundError(f"Columns file not found at {columns_path}")

    model = joblib.load(model_path)
    model_columns = joblib.load(columns_path)
except Exception as e:
    import traceback
    startup_error = traceback.format_exc()

# ── FastAPI app ────────────────────────────────────────────────────────────
app = FastAPI(
    title="Credit Card Default Risk Prediction API",
    description="Predict whether a credit card holder will default on their next payment.",
    version="2.0.0",
)

# CORS – allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routes ─────────────────────────────────────────────────────────────────
@app.get("/api/", tags=["Health"])
@app.get("/api/health", tags=["Health"])
def health_check():
    if startup_error:
        return {"status": "error", "message": startup_error}
    return {"status": "ok", "model_loaded": model is not None, "features": len(model_columns)}


@app.post("/api/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(data: CreditInput, db: Session = Depends(get_db)):
    """Run the credit-default model and persist the result."""

    input_dict = data.model_dump()
    features = [[input_dict[col] for col in model_columns]]

    # Prediction
    prediction = int(model.predict(features)[0])
    probability = float(model.predict_proba(features)[0][1])  # P(default)
    risk_level = "High Default Risk" if prediction == 1 else "Low Default Risk"

    # Persist to DB
    record = PredictionRecord(
        limit_bal=data.LIMIT_BAL,
        age=data.AGE,
        pay_1=data.PAY_1,
        pay_2=data.PAY_2,
        pay_3=data.PAY_3,
        bill_amt1=data.BILL_AMT1,
        pay_amt1=data.PAY_AMT1,
        pay_amt2=data.PAY_AMT2,
        prediction=prediction,
        risk_level=risk_level,
        probability=round(probability, 4),
    )
    db.add(record)
    db.commit()

    return PredictionResponse(
        prediction=prediction,
        risk_level=risk_level,
        default_probability=round(probability, 4),
    )


@app.get("/api/history", response_model=list[HistoryItem], tags=["History"])
def get_history(db: Session = Depends(get_db)):
    """Return all past predictions, newest first."""
    records = (
        db.query(PredictionRecord)
        .order_by(PredictionRecord.created_at.desc())
        .all()
    )
    return records
