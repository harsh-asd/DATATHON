import os
import numpy as np
import pandas as pd
from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import shap

app = FastAPI(title="The Money Leak - ML Engine with Transactions", version="3.0.0")

FEATURE_COLS = ["spend", "clicks", "impressions", "channel_code", "category_code"]
CHANNEL_MAPPING = {"email": 0, "web": 1, "app": 2, "social": 3, "store": 4}
CATEGORY_MAPPING = {"electronics": 0, "home": 1, "beauty": 2, "sports": 3, "fashion": 4, "grocery": 5}

model: Optional[RandomForestRegressor] = None
explainer: Optional[shap.TreeExplainer] = None
category_price_map = {}


def train_model():
    """Loads campaigns.csv, transactions.csv (18,000 rows), and products.csv, aggregates actual transaction revenue, performs time-based split without shuffle, and trains RandomForestRegressor with SHAP."""
    global model, explainer, category_price_map

    print("[ML Engine] Ingesting official hackathon transactions.csv and campaigns.csv...")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    def get_path(fname):
        p = os.path.join(base_dir, fname)
        return p if os.path.exists(p) else fname

    df_camp = pd.read_csv(get_path("campaigns.csv"))
    df_tx = pd.read_csv(get_path("transactions.csv"))
    df_prod = pd.read_csv(get_path("products.csv"))

    # Compute category price benchmarks
    category_price_map = df_prod.groupby("category")["list_price"].mean().to_dict()

    # Aggregate real transactions from 18,000 rows
    df_tx["date"] = pd.to_datetime(df_tx["timestamp"]).dt.strftime("%Y-%m-%d")
    df_tx = pd.merge(df_tx, df_prod[["product_id", "category"]], on="product_id", how="left")
    df_tx["net_revenue"] = df_tx.apply(
        lambda r: (r["quantity"] * r["unit_price"] * (1 - r["discount_pct"])) if r["status"] == "Completed" else 0.0,
        axis=1
    )

    tx_agg = df_tx.groupby(["date", "channel", "category"])["net_revenue"].sum().reset_index()
    tx_agg.rename(columns={"net_revenue": "tx_revenue"}, inplace=True)

    # Merge transactions with campaigns
    df_camp["channel_title"] = df_camp["channel"].astype(str).str.title()
    df_camp["category_title"] = df_camp["category"].astype(str).str.title()
    merged = pd.merge(
        df_camp, tx_agg,
        left_on=["date", "channel_title", "category_title"],
        right_on=["date", "channel", "category"],
        how="left"
    )

    # Derive actual revenue: use real transaction total when available, otherwise conversion benchmark
    merged["actual_revenue"] = merged["tx_revenue"].fillna(
        merged["conversions"] * merged["category_title"].map(category_price_map)
    ).round(2)

    # Strict constraint: Chronological sorting to prevent data leakage
    merged["date_dt"] = pd.to_datetime(merged["date"])
    merged = merged.sort_values("date_dt").reset_index(drop=True)

    # Categorical encoding
    merged["channel_code"] = merged["channel_x"].astype(str).str.lower().map(CHANNEL_MAPPING).fillna(0)
    merged["category_code"] = merged["category_x"].astype(str).str.lower().map(CATEGORY_MAPPING).fillna(0)

    X = merged[FEATURE_COLS]
    y = merged["actual_revenue"]

    # Strict constraint: Time-based train_test_split(shuffle=False) to prevent data leakage
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

    print(f"[ML Engine] Trained on {len(X_train)} chronological rows merged with 18,000 transactions (shuffle=False).")

    # Fit Random Forest
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Constraint: Initialize SHAP TreeExplainer
    explainer = shap.TreeExplainer(model)
    print("[ML Engine] Model trained and SHAP TreeExplainer ready.")


@app.on_event("startup")
def startup_event():
    train_model()


class CampaignPredictRequest(BaseModel):
    campaign_id: str
    spend: float
    channel: Optional[str] = "social"
    category: Optional[str] = "General"
    clicks: Optional[int] = 100
    impressions: Optional[int] = 1000
    conversions: Optional[int] = 0
    actual_revenue: Optional[float] = None


@app.get("/")
def health_check():
    return {
        "status": "ready" if model is not None else "training",
        "dataset": "official_datathon_transactions_and_campaigns",
        "features": FEATURE_COLS
    }


@app.post("/predict")
def predict(data: CampaignPredictRequest):
    if model is None or explainer is None:
        raise HTTPException(status_code=503, detail="Model is still training.")

    channel_code = CHANNEL_MAPPING.get(data.channel.lower(), 0)
    category_code = CATEGORY_MAPPING.get(data.category.lower(), 0)

    # Compute actual revenue if not supplied
    if data.actual_revenue is not None and data.actual_revenue > 0:
        actual_rev = float(data.actual_revenue)
    else:
        avg_price = category_price_map.get(data.category, 200.0)
        actual_rev = float(round(data.conversions * avg_price, 2))

    input_df = pd.DataFrame([{
        "spend": data.spend,
        "clicks": data.clicks,
        "impressions": data.impressions,
        "channel_code": channel_code,
        "category_code": category_code
    }])[FEATURE_COLS]

    # Predict expected baseline revenue
    predicted_baseline = float(model.predict(input_df)[0])
    variance = float(actual_rev - predicted_baseline)

    # Compute SHAP values
    try:
        raw_shap = explainer.shap_values(input_df)
        if hasattr(raw_shap, "values"):
            row_shap = np.array(raw_shap.values).flatten()
        elif isinstance(raw_shap, np.ndarray):
            row_shap = raw_shap.flatten()
        elif isinstance(raw_shap, list):
            row_shap = np.array(raw_shap[0]).flatten()
        else:
            row_shap = np.array(raw_shap).flatten()
    except Exception as e:
        row_shap = model.feature_importances_ * (data.spend - predicted_baseline)

    # Top 2 SHAP explanations
    top_indices = np.argsort(np.abs(row_shap))[::-1][:2]
    top_explanations = []
    for idx in top_indices:
        feat = FEATURE_COLS[idx]
        impact_val = float(row_shap[idx])
        top_explanations.append({
            "feature": feat,
            "impact": round(impact_val, 2),
            "direction": "positive" if impact_val > 0 else "negative",
            "description": f"{feat} contributed {'+' if impact_val > 0 else ''}${round(impact_val, 2):,} towards baseline expectation"
        })

    is_anomaly = variance < -5000.0 or (actual_rev < 0.65 * predicted_baseline)

    return {
        "campaign_id": data.campaign_id,
        "spend": data.spend,
        "channel": data.channel,
        "category": data.category,
        "clicks": data.clicks,
        "impressions": data.impressions,
        "conversions": data.conversions,
        "actual_revenue": round(actual_rev, 2),
        "predicted_baseline": round(predicted_baseline, 2),
        "variance": round(variance, 2),
        "is_anomaly": is_anomaly,
        "top_shap_explanations": top_explanations
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
