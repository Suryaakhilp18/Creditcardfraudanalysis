import pandas as pd
import numpy as np
import json
import os
import pickle
import time
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_auc_score

print("=== Credit Card Fraud Analysis: Building Data Assets ===")
start_total = time.time()

csv_file = "credit_card_fraud_analysis_6plus_years.csv"
if not os.path.exists(csv_file):
    raise FileNotFoundError(f"Dataset file '{csv_file}' not found.")

df_raw = pd.read_csv(csv_file, low_memory=False)
raw_rows, raw_cols = df_raw.shape
print(f"1. Raw Dataset Loaded: {raw_rows} rows, {raw_cols} columns")

# Raw column analysis
raw_columns_list = list(df_raw.columns)
raw_dtypes = {col: str(dtype) for col, dtype in df_raw.dtypes.items()}
raw_missing = {col: int(cnt) for col, cnt in df_raw.isnull().sum().items()}

legacy_columns = [
    "transaction_id", "amount", "transaction_hour", "merchant_category",
    "foreign_transaction", "location_mismatch", "device_trust_score",
    "velocity_last_24h", "cardholder_age", "is_fraud"
]
legacy_cols_present = [c for c in legacy_columns if c in df_raw.columns]

# Step 4: Drop legacy columns
df_clean = df_raw.drop(columns=legacy_cols_present)

# Standardize Is_Fraud target
df_clean["Is_Fraud"] = pd.to_numeric(df_clean["Is_Fraud"], errors="coerce")
valid_mask = df_clean["Is_Fraud"].notna()
invalid_target_rows = int((~valid_mask).sum())
df_clean = df_clean[valid_mask].copy()
df_clean["Is_Fraud"] = df_clean["Is_Fraud"].astype(int)
clean_rows, clean_cols = df_clean.shape
print(f"2. Cleaned Valid Rows: {clean_rows}, Columns: {clean_cols}")

# Target counts
fraud_counts = df_clean["Is_Fraud"].value_counts().to_dict()
legit_count = int(fraud_counts.get(0, 0))
fraud_count = int(fraud_counts.get(1, 0))
fraud_rate = round(float(df_clean["Is_Fraud"].mean() * 100), 2)
exact_fraud_pct = float(df_clean["Is_Fraud"].mean().round(4) * 100)

print(f"3. Legit: {legit_count}, Fraud: {fraud_count}, Fraud Rate: {fraud_rate}%")

# Transaction Amount metrics
min_amount = round(float(df_clean["Transaction_Amount"].min()), 2)
max_amount = round(float(df_clean["Transaction_Amount"].max()), 2)
overall_avg_amount = round(float(df_clean["Transaction_Amount"].mean()), 2)
median_amount = round(float(df_clean["Transaction_Amount"].median()), 2)
amount_by_fraud = df_clean.groupby("Is_Fraud")["Transaction_Amount"].mean().round(2).to_dict()
legit_avg_amount = round(float(amount_by_fraud.get(0, 0)), 2)
fraud_avg_amount = round(float(amount_by_fraud.get(1, 0)), 2)

# Customer Gender Mode Imputation
gender_counts_raw = df_clean["Customer_Gender"].value_counts().to_dict()
mode_gender = df_clean["Customer_Gender"].mode()[0]
df_clean["Customer_Gender"] = df_clean["Customer_Gender"].fillna(mode_gender)
gender_counts_clean = df_clean["Customer_Gender"].value_counts().to_dict()

# Customer Income & Credit Score by Fraud
income_by_fraud = df_clean.groupby("Is_Fraud")["Customer_Income"].mean().round(2).to_dict()
credit_score_by_fraud = df_clean.groupby("Is_Fraud")["Credit_Score"].mean().round(2).to_dict()

# Crosstabs from reference HTML
channel_ct = pd.crosstab(df_clean["Transaction_Channel"], df_clean["Is_Fraud"])
channel_data = []
for ch in channel_ct.index:
    leg = int(channel_ct.loc[ch, 0]) if 0 in channel_ct.columns else 0
    frd = int(channel_ct.loc[ch, 1]) if 1 in channel_ct.columns else 0
    tot = leg + frd
    channel_data.append({
        "channel": str(ch),
        "legitimate": leg,
        "fraud": frd,
        "total": tot,
        "fraud_rate": round(float(frd / tot * 100), 2) if tot > 0 else 0
    })

payment_ct = pd.crosstab(df_clean["Payment_Method"], df_clean["Is_Fraud"])
payment_data = []
for pm in payment_ct.index:
    leg = int(payment_ct.loc[pm, 0]) if 0 in payment_ct.columns else 0
    frd = int(payment_ct.loc[pm, 1]) if 1 in payment_ct.columns else 0
    tot = leg + frd
    payment_data.append({
        "payment_method": str(pm),
        "legitimate": leg,
        "fraud": frd,
        "total": tot,
        "fraud_rate": round(float(frd / tot * 100), 2) if tot > 0 else 0
    })

card_type_ct = pd.crosstab(df_clean["Card_Type"], df_clean["Is_Fraud"])
card_type_data = []
for ct in card_type_ct.index:
    leg = int(card_type_ct.loc[ct, 0]) if 0 in card_type_ct.columns else 0
    frd = int(card_type_ct.loc[ct, 1]) if 1 in card_type_ct.columns else 0
    tot = leg + frd
    card_type_data.append({
        "card_type": str(ct),
        "legitimate": leg,
        "fraud": frd,
        "total": tot,
        "fraud_rate": round(float(frd / tot * 100), 2) if tot > 0 else 0
    })

auth_ct = pd.crosstab(df_clean["Authentication_Method"], df_clean["Is_Fraud"])
auth_data = []
for am in auth_ct.index:
    leg = int(auth_ct.loc[am, 0]) if 0 in auth_ct.columns else 0
    frd = int(auth_ct.loc[am, 1]) if 1 in auth_ct.columns else 0
    tot = leg + frd
    auth_data.append({
        "auth_method": str(am),
        "legitimate": leg,
        "fraud": frd,
        "total": tot,
        "fraud_rate": round(float(frd / tot * 100), 2) if tot > 0 else 0
    })

device_ct = pd.crosstab(df_clean["Device_Type"], df_clean["Is_Fraud"])
device_data = []
for dt in device_ct.index:
    leg = int(device_ct.loc[dt, 0]) if 0 in device_ct.columns else 0
    frd = int(device_ct.loc[dt, 1]) if 1 in device_ct.columns else 0
    tot = leg + frd
    device_data.append({
        "device_type": str(dt),
        "legitimate": leg,
        "fraud": frd,
        "total": tot,
        "fraud_rate": round(float(frd / tot * 100), 2) if tot > 0 else 0
    })

weekend_ct = pd.crosstab(df_clean["Is_Weekend"], df_clean["Is_Fraud"])
weekend_data = []
for wk in weekend_ct.index:
    leg = int(weekend_ct.loc[wk, 0]) if 0 in weekend_ct.columns else 0
    frd = int(weekend_ct.loc[wk, 1]) if 1 in weekend_ct.columns else 0
    tot = leg + frd
    weekend_data.append({
        "is_weekend": str(wk),
        "legitimate": leg,
        "fraud": frd,
        "total": tot,
        "fraud_rate": round(float(frd / tot * 100), 2) if tot > 0 else 0
    })

# Distributions
card_category_counts = {str(k): int(v) for k, v in df_clean["Card_Category"].value_counts().items()}
merchant_category_counts = {str(k): int(v) for k, v in df_clean["Merchant_Category"].value_counts().items()}

# Whitelist Chart 2: Histogram of Transaction Amount (bins=10)
hist_counts, bin_edges = np.histogram(df_clean["Transaction_Amount"], bins=10)
amount_histogram = []
for i in range(len(hist_counts)):
    amount_histogram.append({
        "bin_label": f"${bin_edges[i]:,.0f} - ${bin_edges[i+1]:,.0f}",
        "min": round(float(bin_edges[i]), 2),
        "max": round(float(bin_edges[i+1]), 2),
        "count": int(hist_counts[i]),
        "pct": round(float(hist_counts[i] / clean_rows * 100), 2)
    })

# Whitelist Chart 6: Average Transaction Amount by Recent Transaction Frequency (Transactions_Last_24H head 15)
avg_amount_by_velocity = df_clean.groupby("Transactions_Last_24H")["Transaction_Amount"].mean().head(15)
velocity_amount_data = [
    {"transactions_last_24h": int(k), "avg_amount": round(float(v), 2)}
    for k, v in avg_amount_by_velocity.items()
]

# Whitelist Chart 7: Fraud Rate by Transaction Hour (0 to 23)
fraud_by_hour = df_clean.groupby("Transaction_Hour")["Is_Fraud"].mean() * 100
hourly_fraud_data = [
    {"hour": int(h), "hour_label": f"{int(h):02d}:00", "fraud_rate": round(float(rate), 2)}
    for h, rate in fraud_by_hour.items()
]

# Statistical describe tables
numeric_describe = {}
for col in df_clean.select_dtypes(include=[np.number]).columns:
    desc = df_clean[col].describe()
    numeric_describe[col] = {
        "count": int(desc["count"]),
        "mean": round(float(desc["mean"]), 2),
        "std": round(float(desc["std"]), 2),
        "min": round(float(desc["min"]), 2),
        "25%": round(float(desc["25%"]), 2),
        "50%": round(float(desc["50%"]), 2),
        "75%": round(float(desc["75%"]), 2),
        "max": round(float(desc["max"]), 2),
    }

object_describe = {}
for col in df_clean.select_dtypes(include=["object"]).columns:
    desc = df_clean[col].describe()
    object_describe[col] = {
        "count": int(desc["count"]),
        "unique": int(desc["unique"]),
        "top": str(desc["top"]),
        "freq": int(desc["freq"]),
    }

# ==================== STEP 5: FEATURE ENGINEERING & ML ====================
print("4. Executing Feature Engineering & Preprocessing...")
df_feat = df_clean.copy()

# Drop identifier columns
id_cols_dropped = ["Transaction_ID", "Customer_ID", "Card_ID", "Merchant_ID", "Device_ID", "IP_Address"]
df_feat = df_feat.drop([c for c in id_cols_dropped if c in df_feat.columns], axis=1)

# Drop information leakage columns
leakage_cols_dropped = [
    "Fraud_Type", "Fraud_Detection_Method", "Fraud_Probability",
    "Transaction_Status", "Chargeback", "Alert_Generated", "Risk_Score"
]
df_feat = df_feat.drop([c for c in leakage_cols_dropped if c in df_feat.columns], axis=1)

# Add 4 new engineered features
df_feat["Amount_to_CreditLimit_Ratio"] = df_feat["Transaction_Amount"] / df_feat["Credit_Limit"]
df_feat["Amount_to_Average_Ratio"] = df_feat["Transaction_Amount"] / df_feat["Avg_Transaction_Amount_30D"].replace(0, np.nan)
df_feat["Amount_to_Average_Ratio"] = df_feat["Amount_to_Average_Ratio"].fillna(0)
df_feat["High_Risk_Transaction"] = (df_feat["IP_Risk_Score"] >= 70).astype(int)
df_feat["High_Frequency"] = (df_feat["Transactions_Last_24H"] >= 8).astype(int)

# Drop Transaction_DateTime
if "Transaction_DateTime" in df_feat.columns:
    df_feat = df_feat.drop("Transaction_DateTime", axis=1)

# Imputation
num_cols = df_feat.select_dtypes(include=["int64", "float64", "int32", "float32", "bool"]).columns
medians = {}
for col in num_cols:
    if col != "Is_Fraud":
        med = float(df_feat[col].median())
        medians[col] = med
        df_feat[col] = df_feat[col].fillna(med)

cat_cols = df_feat.select_dtypes(include=["object", "category"]).columns
modes = {}
for col in cat_cols:
    mod = str(df_feat[col].mode()[0])
    modes[col] = mod
    df_feat[col] = df_feat[col].fillna(mod)

# Binary columns mapping
binary_cols = ["VPN_Used", "Proxy_Used", "Is_Weekend", "CVV_Provided", "PIN_Used", "OTP_Used", "Card_Present"]
for col in binary_cols:
    if col in df_feat.columns:
        df_feat[col] = df_feat[col].map({"Yes": 1, "No": 0, True: 1, False: 0}).fillna(0).astype(int)

# Categorical Label Encoders
label_encoders = {}
for col in df_feat.select_dtypes(include=["object", "category"]).columns:
    le = LabelEncoder()
    df_feat[col] = le.fit_transform(df_feat[col].astype(str))
    label_encoders[col] = {str(c): int(i) for i, c in enumerate(le.classes_)}

# StandardScaler
scale_columns = [c for c in [
    "Customer_Age", "Customer_Income", "Credit_Limit", "Credit_Score", "Account_Age_Months",
    "Card_Tenure_Months", "Transaction_Amount", "IP_Risk_Score", "Transaction_Hour",
    "Previous_Transaction_Gap_Minutes", "Transactions_Last_24H", "Transactions_Last_7D",
    "Avg_Transaction_Amount_30D", "Amount_Deviation_Pct", "Distance_From_Last_Transaction_KM",
    "Failed_Authentication_Count", "Year", "Month", "Quarter",
    "Amount_to_CreditLimit_Ratio", "Amount_to_Average_Ratio"
] if c in df_feat.columns]

scaler = StandardScaler()
df_feat[scale_columns] = scaler.fit_transform(df_feat[scale_columns])

feature_columns = [c for c in df_feat.columns if c != "Is_Fraud"]
X = df_feat[feature_columns]
y = df_feat["Is_Fraud"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"5. Features: {len(feature_columns)}, Train: {len(X_train)}, Test: {len(X_test)}")

# Train Models
models = {
    "Logistic Regression": LogisticRegression(max_iter=2000, class_weight="balanced", random_state=42),
    "Decision Tree": DecisionTreeClassifier(max_depth=10, class_weight="balanced", random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=12, class_weight="balanced", random_state=42, n_jobs=-1)
}

trained_models = {}
model_evaluation_metrics = {}

for name, clf in models.items():
    t0 = time.time()
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)[:, 1] if hasattr(clf, "predict_proba") else None
    t1 = time.time()
    
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    auc = float(roc_auc_score(y_test, y_prob)) if y_prob is not None else 0.0
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    trained_models[name] = clf
    model_evaluation_metrics[name] = {
        "model_name": name,
        "train_time_sec": round(t1 - t0, 3),
        "accuracy": round(acc, 4),
        "accuracy_pct": round(acc * 100, 2),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "recall_pct": round(rec * 100, 2),
        "f1_score": round(f1, 4),
        "roc_auc": round(auc, 4),
        "confusion_matrix": {
            "tn": cm[0][0], "fp": cm[0][1],
            "fn": cm[1][0], "tp": cm[1][1],
            "total": int(len(y_test))
        }
    }
    print(f"[{name}] Acc: {acc*100:.2f}%, Prec: {prec:.4f}, Rec: {rec:.4f}, F1: {f1:.4f}, AUC: {auc:.4f}")

# Save model pickle as required by Step 11
with open("credit_card_fraud_model.pkl", "wb") as f:
    pickle.dump({
        "model": trained_models["Random Forest"],
        "all_models": trained_models,
        "scaler": scaler,
        "scale_columns": scale_columns,
        "feature_columns": feature_columns,
        "label_encoders": label_encoders,
        "medians": medians,
        "modes": modes,
        "binary_cols": binary_cols
    }, f)
print("6. Saved credit_card_fraud_model.pkl successfully!")

# Extract Sample Transactions for Explorer (500 representative records)
# Pick a balanced mix of fraud and non-fraud across years and categories
fraud_sample = df_clean[df_clean["Is_Fraud"] == 1].sample(n=100, random_state=42)
legit_sample = df_clean[df_clean["Is_Fraud"] == 0].sample(n=400, random_state=42)
sample_combined = pd.concat([fraud_sample, legit_sample]).sample(frac=1, random_state=42)

sample_transactions = []
for idx, row in sample_combined.iterrows():
    sample_transactions.append({
        "id": str(row.get("Transaction_ID", f"TXN_{idx}")),
        "customer_id": str(row.get("Customer_ID", f"CUST_{idx}")),
        "card_type": str(row.get("Card_Type", "Visa")),
        "card_category": str(row.get("Card_Category", "Classic")),
        "customer_gender": str(row.get("Customer_Gender", "Male")),
        "customer_income": round(float(row.get("Customer_Income", 0)), 2),
        "credit_limit": round(float(row.get("Credit_Limit", 0)), 2),
        "credit_score": int(row.get("Credit_Score", 700)),
        "transaction_amount": round(float(row.get("Transaction_Amount", 0)), 2),
        "merchant_category": str(row.get("Merchant_Category", "Online")),
        "merchant_country": str(row.get("Merchant_Country", "India")),
        "merchant_city": str(row.get("Merchant_City", "Delhi")),
        "transaction_channel": str(row.get("Transaction_Channel", "Online")),
        "payment_method": str(row.get("Payment_Method", "Chip")),
        "device_type": str(row.get("Device_Type", "Mobile")),
        "transaction_hour": int(row.get("Transaction_Hour", 12)),
        "day_of_week": str(row.get("Day_of_Week", "Monday")),
        "is_weekend": str(row.get("Is_Weekend", "No")),
        "transactions_last_24h": int(row.get("Transactions_Last_24H", 0)),
        "ip_risk_score": round(float(row.get("IP_Risk_Score", 0)), 2),
        "distance_km": round(float(row.get("Distance_From_Last_Transaction_KM", 0)), 2),
        "is_fraud": int(row.get("Is_Fraud", 0)),
        "fraud_label": "Fraud" if int(row.get("Is_Fraud", 0)) == 1 else "Legitimate",
        "fraud_type": str(row.get("Fraud_Type", "Legitimate")),
        "alert_generated": str(row.get("Alert_Generated", "No")),
        "year": int(row.get("Year", 2022)) if pd.notna(row.get("Year")) else 2022,
        "month_name": str(row.get("Month_Name", "January"))
    })

# Feature importances from Random Forest
rf_importances = []
rf = trained_models["Random Forest"]
if hasattr(rf, "feature_importances_"):
    imp = rf.feature_importances_
    sorted_idx = np.argsort(imp)[::-1]
    for i in sorted_idx[:15]:
        rf_importances.append({
            "feature": feature_columns[i],
            "importance": round(float(imp[i]), 4),
            "percentage": round(float(imp[i] * 100), 2)
        })

# Feature coefficients from Logistic Regression
lr_coefs = []
lr = trained_models["Logistic Regression"]
if hasattr(lr, "coef_"):
    coef = lr.coef_[0]
    sorted_cidx = np.argsort(np.abs(coef))[::-1]
    for i in sorted_cidx[:15]:
        lr_coefs.append({
            "feature": feature_columns[i],
            "coefficient": round(float(coef[i]), 4),
            "impact": "Increases Fraud Risk" if coef[i] > 0 else "Decreases Fraud Risk"
        })

# Package all summary stats
summary_data = {
    "project_title": "Credit Card Fraud Analysis & Detection System",
    "subtitle": "Data Analytics & Machine Learning Project",
    "dataset_info": {
        "name": "Credit Card Fraud Dataset",
        "raw_rows": raw_rows,
        "raw_columns": raw_cols,
        "cleaned_rows": clean_rows,
        "cleaned_columns": clean_cols,
        "feature_count": len(feature_columns),
        "legacy_columns_dropped": legacy_cols_present,
        "legacy_rows_dropped": invalid_target_rows,
        "id_columns_dropped": id_cols_dropped,
        "leakage_columns_dropped": leakage_cols_dropped,
        "new_features_engineered": [
            "Amount_to_CreditLimit_Ratio",
            "Amount_to_Average_Ratio",
            "High_Risk_Transaction",
            "High_Frequency"
        ]
    },
    "kpis": {
        "total_transactions": clean_rows,
        "legitimate_transactions": legit_count,
        "fraudulent_transactions": fraud_count,
        "fraud_rate_pct": fraud_rate,
        "exact_fraud_pct": exact_fraud_pct,
        "min_transaction_amount": min_amount,
        "max_transaction_amount": max_amount,
        "avg_transaction_amount": overall_avg_amount,
        "median_transaction_amount": median_amount,
        "legit_avg_amount": legit_avg_amount,
        "fraud_avg_amount": fraud_avg_amount,
        "legit_avg_income": float(income_by_fraud.get(0, 0)),
        "fraud_avg_income": float(income_by_fraud.get(1, 0)),
        "legit_avg_credit_score": float(credit_score_by_fraud.get(0, 0)),
        "fraud_avg_credit_score": float(credit_score_by_fraud.get(1, 0))
    },
    "charts": {
        "fraud_distribution": [
            {"label": "Legitimate", "value": legit_count, "pct": round(float(legit_count / clean_rows * 100), 2), "color": "#10b981"},
            {"label": "Fraud", "value": fraud_count, "pct": round(float(fraud_count / clean_rows * 100), 2), "color": "#ef4444"}
        ],
        "amount_histogram": amount_histogram,
        "amount_by_fraud": [
            {"status": "Legitimate", "amount": legit_avg_amount, "color": "#10b981"},
            {"status": "Fraud", "amount": fraud_avg_amount, "color": "#ef4444"}
        ],
        "gender_distribution": [
            {"gender": "Male", "count": int(gender_counts_clean.get("Male", 0)), "pct": round(float(gender_counts_clean.get("Male", 0) / clean_rows * 100), 2), "color": "#3b82f6"},
            {"gender": "Female", "count": int(gender_counts_clean.get("Female", 0)), "pct": round(float(gender_counts_clean.get("Female", 0) / clean_rows * 100), 2), "color": "#ec4899"},
            {"gender": "Other", "count": int(gender_counts_clean.get("Other", 0)), "pct": round(float(gender_counts_clean.get("Other", 0) / clean_rows * 100), 2), "color": "#8b5cf6"}
        ],
        "channel_fraud": channel_data,
        "velocity_amount": velocity_amount_data,
        "hourly_fraud_rate": hourly_fraud_data
    },
    "tables": {
        "card_type": card_type_data,
        "card_category": [{"category": k, "count": v, "pct": round(v / clean_rows * 100, 2)} for k, v in card_category_counts.items()],
        "device_type": device_data,
        "payment_method": payment_data,
        "authentication_method": auth_data,
        "weekend_analysis": weekend_data,
        "merchant_category": [{"category": k, "count": v, "pct": round(v / clean_rows * 100, 2)} for k, v in merchant_category_counts.items()]
    },
    "exploration": {
        "numeric_describe": numeric_describe,
        "object_describe": object_describe,
        "raw_columns_list": raw_columns_list,
        "raw_missing": raw_missing,
        "raw_dtypes": raw_dtypes,
        "feature_columns": feature_columns
    },
    "model_evaluation": {
        "split_summary": {
            "total_samples": clean_rows,
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "train_ratio": 0.8,
            "test_ratio": 0.2,
            "stratified": True,
            "random_state": 42
        },
        "models": model_evaluation_metrics,
        "random_forest_importances": rf_importances,
        "logistic_regression_coefficients": lr_coefs
    }
}

os.makedirs("public/dataset", exist_ok=True)
with open("public/dataset/eda_summary.json", "w", encoding="utf-8") as f:
    json.dump(summary_data, f, indent=2)

with open("public/dataset/sample_transactions.json", "w", encoding="utf-8") as f:
    json.dump(sample_transactions, f, indent=2)

print(f"7. Generated public/dataset/eda_summary.json ({os.path.getsize('public/dataset/eda_summary.json') / 1024:.1f} KB)")
print(f"8. Generated public/dataset/sample_transactions.json ({os.path.getsize('public/dataset/sample_transactions.json') / 1024:.1f} KB)")
print(f"=== Complete Pipeline Execution Finished in {time.time() - start_total:.2f}s ===")
