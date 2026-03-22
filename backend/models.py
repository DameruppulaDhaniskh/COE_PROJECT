"""
SQLAlchemy ORM model for prediction history records.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Float, String, DateTime
from database import Base


class PredictionRecord(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # ── Input features (8 selected) ────────────────────────────────
    limit_bal = Column(Float, nullable=False)
    age = Column(Integer, nullable=False)

    pay_1 = Column(Integer, nullable=False)
    pay_2 = Column(Integer, nullable=False)
    pay_3 = Column(Integer, nullable=False)

    bill_amt1 = Column(Float, nullable=False)
    pay_amt1 = Column(Float, nullable=False)
    pay_amt2 = Column(Float, nullable=False)

    # ── Prediction output ───────────────────────────────────────────
    prediction = Column(Integer, nullable=False)       # 0 or 1
    risk_level = Column(String, nullable=False)        # "High Default Risk" / "Low Default Risk"
    probability = Column(Float, nullable=False)        # probability of default

    # ── Metadata ────────────────────────────────────────────────────
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
