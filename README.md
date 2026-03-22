# 🛡️ CreditGuard AI — Credit Card Default Risk Prediction

A full-stack machine learning application that predicts whether a credit card holder will **default on their next payment**. Built with **FastAPI**, **React**, **SQLite**, and **scikit-learn**.

---

## 📁 Project Structure

```
credit-risk-prediction/
├── backend/               # FastAPI REST API
│   ├── main.py            # App entry-point, routes, CORS
│   ├── schemas.py         # Pydantic request / response models
│   ├── database.py        # SQLAlchemy engine & session
│   ├── models.py          # ORM model (PredictionRecord)
│   └── requirements.txt   # Python dependencies
├── frontend/              # React + Vite UI
│   └── src/
│       ├── pages/         # PredictPage, DashboardPage
│       ├── components/    # Navbar, PredictionForm, ResultCard
│       └── api/           # Axios instance
├── models/                # Trained ML artefacts
│   ├── credit_model.pkl
│   └── model_columns.pkl
├── database/              # SQLite DB (auto-created)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

| Tool    | Version |
|---------|---------|
| Python  | 3.10+   |
| Node.js | 18+     |
| npm     | 9+      |

### 1. Backend

```bash
cd credit-risk-prediction/backend

# Create & activate virtual environment (recommended)
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

The API will be available at **http://localhost:8000**.  
Interactive docs (Swagger UI) → **http://localhost:8000/docs**

### 2. Frontend

```bash
cd credit-risk-prediction/frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔌 API Documentation

### `GET /`
Health check endpoint.

**Response:**
```json
{ "status": "ok", "model_loaded": true }
```

---

### `POST /predict`
Run a credit-default prediction.

**Request body (JSON):**
```json
{
  "LIMIT_BAL": 20000,
  "SEX": 2,
  "EDUCATION": 2,
  "MARRIAGE": 1,
  "AGE": 24,
  "PAY_1": 2,
  "PAY_2": 2,
  "PAY_3": -1,
  "PAY_4": -1,
  "PAY_5": -2,
  "PAY_6": -2,
  "BILL_AMT1": 3913,
  "BILL_AMT2": 3102,
  "BILL_AMT3": 689,
  "BILL_AMT4": 0,
  "BILL_AMT5": 0,
  "BILL_AMT6": 0,
  "PAY_AMT1": 0,
  "PAY_AMT2": 689,
  "PAY_AMT3": 0,
  "PAY_AMT4": 0,
  "PAY_AMT5": 0,
  "PAY_AMT6": 0
}
```

**Response:**
```json
{
  "prediction": 1,
  "risk_level": "High Risk",
  "probability": 0.7820
}
```

---

### `GET /history`
Retrieve all stored prediction records (newest first).

**Response:** Array of objects with `id`, `limit_bal`, `sex`, `education`, `marriage`, `age`, `prediction`, `risk_level`, `probability`, `created_at`.

---

### Example `curl` Request

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "LIMIT_BAL":20000,"SEX":2,"EDUCATION":2,"MARRIAGE":1,"AGE":24,
    "PAY_1":2,"PAY_2":2,"PAY_3":-1,"PAY_4":-1,"PAY_5":-2,"PAY_6":-2,
    "BILL_AMT1":3913,"BILL_AMT2":3102,"BILL_AMT3":689,
    "BILL_AMT4":0,"BILL_AMT5":0,"BILL_AMT6":0,
    "PAY_AMT1":0,"PAY_AMT2":689,"PAY_AMT3":0,
    "PAY_AMT4":0,"PAY_AMT5":0,"PAY_AMT6":0
  }'
```

---

## 📊 Features

| Feature | Description |
|---------|-------------|
| **Predict Page** | Form to enter all 23 credit features with real-time validation |
| **Result Card** | Styled card showing risk level, default/no-default label, and probability bar |
| **Dashboard** | Stat cards, pie chart (High vs Low Risk), bar chart (by education), history table |
| **Persistence** | Every prediction is stored in SQLite with full input + output + timestamp |

---

## 🧠 Model Details

- **Algorithm:** Random Forest Classifier (scikit-learn)
- **Dataset:** UCI Credit Card Default dataset (30,000 records)
- **Features:** 23 input variables (demographics, payment history, bill amounts, payment amounts)
- **Target:** `default.payment.next.month` (0 = No Default, 1 = Default)

---

## 📄 License

This project is for educational purposes.
