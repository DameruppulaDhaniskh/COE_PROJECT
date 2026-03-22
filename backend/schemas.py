"""
Pydantic schemas for request validation and response serialization.
"""

from datetime import datetime
from pydantic import BaseModel, Field


class CreditInput(BaseModel):
    """8 selected features for the credit-default model."""

    LIMIT_BAL: float = Field(..., description="Amount of given credit (NT dollar)")
    AGE: int = Field(..., ge=18, le=100, description="Age in years")

    PAY_1: int = Field(..., description="Repayment status in Sep")
    PAY_2: int = Field(..., description="Repayment status in Aug")
    PAY_3: int = Field(..., description="Repayment status in Jul")

    BILL_AMT1: float = Field(..., description="Bill statement amount in Sep")
    PAY_AMT1: float = Field(..., description="Amount of previous payment in Sep")
    PAY_AMT2: float = Field(..., description="Amount of previous payment in Aug")

    class Config:
        json_schema_extra = {
            "example": {
                "LIMIT_BAL": 20000,
                "AGE": 24,
                "PAY_1": 2,
                "PAY_2": 2,
                "PAY_3": -1,
                "BILL_AMT1": 3913,
                "PAY_AMT1": 0,
                "PAY_AMT2": 689,
            }
        }


class PredictionResponse(BaseModel):
    """Response returned by the /predict endpoint."""

    prediction: int = Field(..., description="0 = No Default, 1 = Default")
    risk_level: str = Field(..., description="High Default Risk or Low Default Risk")
    default_probability: float = Field(..., description="Probability of default (0-1)")


class HistoryItem(BaseModel):
    """Single prediction record returned by /history."""

    id: int
    limit_bal: float
    age: int
    pay_1: int
    pay_2: int
    pay_3: int
    bill_amt1: float
    pay_amt1: float
    pay_amt2: float
    prediction: int
    risk_level: str
    probability: float
    created_at: datetime

    class Config:
        from_attributes = True
