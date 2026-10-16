# The Money Leak: Retail Operations Anomaly Detection Dashboard

An end-to-end full-stack retail operations console and ML microservice designed to detect "Money Leaks" (underperforming ad sets where ad spend outpaces returns or conversions drop drastically below expected baseline).

## Architecture

- **Frontend**: React (Vite) - Desktop operations dashboard displaying:
  - **Alert Feed**: Real-time flagged campaigns with negative variance / capital drain.
  - **Root Cause Panel**: Live SHAP feature attribution (the "Why") breaking down individual feature contributions.
  - **Action Card**: Interactive mitigation controls (e.g. Pause Campaign, Investigate Drivers).
- **Backend**: Node.js / Express bridging local database records and the ML microservice.
- **ML Engine**: Python FastAPI microservice:
  - Trained `RandomForestRegressor` with strict temporal splitting (`train_test_split(shuffle=False)`) to prevent data leakage.
  - Built-in `shap.TreeExplainer` providing mathematical attribution for predictions.

## Datasets

Ingested from DATATHON Challenge 04 (The Money Leak):
- `campaigns.csv` (1,200 campaign records)
- `transactions.csv` (18,000 transaction records)
- `products.csv` (250 products across categories)
- `inventory.csv` (5,000 inventory telemetry records)
- `customers.csv` (3,000 customer records)

## Quick Start

### 1. ML Microservice (FastAPI + Scikit-Learn + SHAP)
```bash
cd ml-service
pip install -r requirements.txt
python main.py
# Runs on http://127.0.0.1:8000
```

### 2. Backend Server (Express)
```bash
cd backend
npm install
node server.js
# Runs on http://localhost:3000
```

### 3. Frontend Dashboard (React + Vite)
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```
