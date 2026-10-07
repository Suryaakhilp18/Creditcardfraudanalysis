from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import pickle
import pandas as pd
import numpy as np
import json
import os

app = FastAPI(title="Credit Card Fraud Detection API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load eda summary
SUMMARY_FILE = "public/dataset/eda_summary.json"
SAMPLE_TXNS_FILE = "public/dataset/sample_transactions.json"
MODEL_FILE = "credit_card_fraud_model.pkl"

eda_summary = {}
if os.path.exists(SUMMARY_FILE):
    with open(SUMMARY_FILE, "r", encoding="utf-8") as f:
        eda_summary = json.load(f)

sample_transactions = []
if os.path.exists(SAMPLE_TXNS_FILE):
    with open(SAMPLE_TXNS_FILE, "r", encoding="utf-8") as f:
        sample_transactions = json.load(f)

# Load model pipeline
model_data = None
if os.path.exists(MODEL_FILE):
    with open(MODEL_FILE, "rb") as f:
        model_data = pickle.load(f)

class PredictionInput(BaseModel):
    model_choice: Optional[str] = "Random Forest"
    card_type: Optional[str] = "Visa"
    card_category: Optional[str] = "Classic"
    customer_age: Optional[float] = 38.0
    customer_gender: Optional[str] = "Male"
    customer_income: Optional[float] = 75000.0
    credit_limit: Optional[float] = 100000.0
    credit_score: Optional[float] = 720.0
    account_age_months: Optional[float] = 48.0
    card_tenure_months: Optional[float] = 24.0
    transaction_amount: Optional[float] = 2500.0
    currency: Optional[str] = "INR"
    merchant_category: Optional[str] = "Online Shopping"
    merchant_country: Optional[str] = "India"
    merchant_city: Optional[str] = "Delhi"
    transaction_channel: Optional[str] = "Online"
    payment_method: Optional[str] = "Online Card"
    device_type: Optional[str] = "Mobile"
    operating_system: Optional[str] = "Android"
    browser: Optional[str] = "Chrome"
    ip_risk_score: Optional[float] = 25.0
    vpn_used: Optional[str] = "No"
    proxy_used: Optional[str] = "No"
    transaction_hour: Optional[float] = 14.0
    day_of_week: Optional[str] = "Wednesday"
    is_weekend: Optional[str] = "No"
    previous_transaction_gap_minutes: Optional[float] = 120.0
    transactions_last_24h: Optional[float] = 3.0
    transactions_last_7d: Optional[float] = 10.0
    avg_transaction_amount_30d: Optional[float] = 2000.0
    amount_deviation_pct: Optional[float] = 25.0
    distance_from_last_transaction_km: Optional[float] = 15.0
    cvv_provided: Optional[str] = "Yes"
    pin_used: Optional[str] = "Yes"
    otp_used: Optional[str] = "Yes"
    authentication_method: Optional[str] = "OTP"
    failed_authentication_count: Optional[float] = 0.0
    card_present: Optional[str] = "No"
    customer_country: Optional[str] = "India"
    customer_state: Optional[str] = "Delhi"
    customer_city: Optional[str] = "Delhi"
    year: Optional[float] = 2024.0
    month: Optional[float] = 4.0
    quarter: Optional[float] = 2.0
    month_name: Optional[str] = "April"

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "dataset_rows": eda_summary.get("dataset_info", {}).get("cleaned_rows", 50000),
        "model_loaded": model_data is not None
    }

@app.get("/api/summary")
def get_summary():
    return eda_summary

@app.get("/api/models")
def get_models():
    return eda_summary.get("model_evaluation", {})

@app.get("/api/transactions")
def get_transactions(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    fraud_filter: Optional[str] = Query("all"),
    search: Optional[str] = Query(""),
    card_type: Optional[str] = Query("all"),
    channel: Optional[str] = Query("all"),
    payment_method: Optional[str] = Query("all"),
    device_type: Optional[str] = Query("all")
):
    filtered = sample_transactions

    if fraud_filter == "fraud":
        filtered = [t for t in filtered if t["is_fraud"] == 1]
    elif fraud_filter == "legitimate":
        filtered = [t for t in filtered if t["is_fraud"] == 0]

    if card_type and card_type != "all":
        filtered = [t for t in filtered if t["card_type"].lower() == card_type.lower()]

    if channel and channel != "all":
        filtered = [t for t in filtered if t["transaction_channel"].lower() == channel.lower()]

    if payment_method and payment_method != "all":
        filtered = [t for t in filtered if t["payment_method"].lower() == payment_method.lower()]

    if device_type and device_type != "all":
        filtered = [t for t in filtered if t["device_type"].lower() == device_type.lower()]

    if search:
        s = search.lower()
        filtered = [
            t for t in filtered
            if s in t["id"].lower()
            or s in t["customer_id"].lower()
            or s in t["merchant_category"].lower()
            or s in t["merchant_city"].lower()
            or s in t["card_type"].lower()
            or s in str(t["transaction_amount"])
        ]

    total_count = len(filtered)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_items = filtered[start_idx:end_idx]

    return {
        "items": paginated_items,
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": int(np.ceil(total_count / limit)) if limit > 0 else 1
    }

@app.post("/api/predict")
def predict_fraud(inp: PredictionInput):
    if not model_data:
        raise HTTPException(status_code=500, detail="Model pipeline not loaded.")

    feature_cols = model_data["feature_columns"]
    scale_cols = model_data["scale_columns"]
    scaler = model_data["scaler"]
    encoders = model_data["label_encoders"]
    all_models = model_data["all_models"]

    # Choose model
    chosen_model_name = inp.model_choice
    if chosen_model_name not in all_models:
        chosen_model_name = "Random Forest"
    clf = all_models[chosen_model_name]

    # Build input dictionary
    row = {
        "Card_Type": inp.card_type,
        "Card_Category": inp.card_category,
        "Customer_Age": inp.customer_age,
        "Customer_Gender": inp.customer_gender,
        "Customer_Income": inp.customer_income,
        "Credit_Limit": inp.credit_limit,
        "Credit_Score": inp.credit_score,
        "Account_Age_Months": inp.account_age_months,
        "Card_Tenure_Months": inp.card_tenure_months,
        "Transaction_Amount": inp.transaction_amount,
        "Currency": inp.currency,
        "Merchant_Category": inp.merchant_category,
        "Merchant_Country": inp.merchant_country,
        "Merchant_City": inp.merchant_city,
        "Transaction_Channel": inp.transaction_channel,
        "Payment_Method": inp.payment_method,
        "Device_Type": inp.device_type,
        "Operating_System": inp.operating_system,
        "Browser": inp.browser,
        "IP_Risk_Score": inp.ip_risk_score,
        "VPN_Used": 1 if str(inp.vpn_used).lower() in ["1", "yes", "true"] else 0,
        "Proxy_Used": 1 if str(inp.proxy_used).lower() in ["1", "yes", "true"] else 0,
        "Transaction_Hour": inp.transaction_hour,
        "Day_of_Week": inp.day_of_week,
        "Is_Weekend": 1 if str(inp.is_weekend).lower() in ["1", "yes", "true"] else 0,
        "Previous_Transaction_Gap_Minutes": inp.previous_transaction_gap_minutes,
        "Transactions_Last_24H": inp.transactions_last_24h,
        "Transactions_Last_7D": inp.transactions_last_7d,
        "Avg_Transaction_Amount_30D": inp.avg_transaction_amount_30d,
        "Amount_Deviation_Pct": inp.amount_deviation_pct,
        "Distance_From_Last_Transaction_KM": inp.distance_from_last_transaction_km,
        "CVV_Provided": 1 if str(inp.cvv_provided).lower() in ["1", "yes", "true"] else 0,
        "PIN_Used": 1 if str(inp.pin_used).lower() in ["1", "yes", "true"] else 0,
        "OTP_Used": 1 if str(inp.otp_used).lower() in ["1", "yes", "true"] else 0,
        "Authentication_Method": inp.authentication_method,
        "Failed_Authentication_Count": inp.failed_authentication_count,
        "Card_Present": 1 if str(inp.card_present).lower() in ["1", "yes", "true"] else 0,
        "Customer_Country": inp.customer_country,
        "Customer_State": inp.customer_state,
        "Customer_City": inp.customer_city,
        "Year": inp.year,
        "Month": inp.month,
        "Quarter": inp.quarter,
        "Month_Name": inp.month_name,
        "Amount_to_CreditLimit_Ratio": inp.transaction_amount / max(inp.credit_limit, 1.0),
        "Amount_to_Average_Ratio": inp.transaction_amount / max(inp.avg_transaction_amount_30d, 1.0),
        "High_Risk_Transaction": 1 if inp.ip_risk_score >= 70 else 0,
        "High_Frequency": 1 if inp.transactions_last_24h >= 8 else 0
    }

    # Encode categoricals using saved encoders
    encoded_row = {}
    for col, val in row.items():
        if col in encoders:
            enc_map = encoders[col]
            s_val = str(val)
            encoded_row[col] = enc_map.get(s_val, 0)
        else:
            encoded_row[col] = val

    # Create DataFrame in exact feature order
    df_single = pd.DataFrame([encoded_row])
    # Scale scale_columns
    df_single[scale_cols] = scaler.transform(df_single[scale_cols])

    X_single = df_single[feature_cols]

    pred = int(clf.predict(X_single)[0])
    prob = float(clf.predict_proba(X_single)[0][1]) if hasattr(clf, "predict_proba") else (0.9 if pred == 1 else 0.1)

    # Risk level determination
    if prob >= 0.70 or pred == 1:
        risk_level = "High"
    elif prob >= 0.40:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    # Identify contributing risk factors
    risk_factors = []
    if inp.ip_risk_score >= 70:
        risk_factors.append(f"Elevated IP Risk Score ({inp.ip_risk_score}/100)")
    if inp.transactions_last_24h >= 8:
        risk_factors.append(f"High Velocity: {inp.transactions_last_24h} transactions in past 24 hours")
    if inp.transaction_amount > (inp.avg_transaction_amount_30d * 3):
        risk_factors.append(f"High Amount Deviation (>3x 30-day average of ${inp.avg_transaction_amount_30d:,.2f})")
    if inp.failed_authentication_count > 0:
        risk_factors.append(f"{int(inp.failed_authentication_count)} failed authentication attempts")
    if str(inp.vpn_used).lower() in ["1", "yes", "true"] or str(inp.proxy_used).lower() in ["1", "yes", "true"]:
        risk_factors.append("VPN / Proxy detected during transaction")
    if str(inp.card_present).lower() in ["0", "no", "false"] and inp.transaction_amount > 5000:
        risk_factors.append("Card-Not-Present high-value transaction")

    if not risk_factors:
        risk_factors.append("Normal transaction behavior matching cardholder baseline")

    return {
        "model_used": chosen_model_name,
        "is_fraud": pred,
        "prediction_label": "Fraudulent" if pred == 1 else "Legitimate",
        "fraud_probability": round(prob * 100, 2),
        "confidence_pct": round(max(prob, 1.0 - prob) * 100, 2),
        "risk_level": risk_level,
        "risk_factors": risk_factors
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8008)
