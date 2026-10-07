import pandas as pd
import numpy as np
import json
import time
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_auc_score

print("Starting pipeline test...")
df = pd.read_csv("credit_card_fraud_analysis_6plus_years.csv", low_memory=False)

# Legacy columns
legacy_columns = ["transaction_id","amount","transaction_hour","merchant_category","foreign_transaction","location_mismatch","device_trust_score","velocity_last_24h","cardholder_age","is_fraud"]
df_cleaned = df.drop(columns=[c for c in legacy_columns if c in df.columns])

# Remove rows where Is_Fraud is null (the 10,000 legacy rows)
df_cleaned["Is_Fraud"] = pd.to_numeric(df_cleaned["Is_Fraud"], errors="coerce")
df_cleaned = df_cleaned[df_cleaned["Is_Fraud"].notna()].copy()
df_cleaned["Is_Fraud"] = df_cleaned["Is_Fraud"].astype(int)

# Fill missing values exactly as reference
# Customer_Gender mode
mode_gender = df_cleaned["Customer_Gender"].mode()[0]
df_cleaned["Customer_Gender"] = df_cleaned["Customer_Gender"].fillna(mode_gender)

# Drop identifier columns
df_feat = df_cleaned.drop(["Transaction_ID","Customer_ID","Card_ID","Merchant_ID","Device_ID","IP_Address"], axis=1)

# Drop information leakage columns
leakage_cols = ["Fraud_Type","Fraud_Detection_Method","Fraud_Probability","Transaction_Status","Chargeback","Alert_Generated","Risk_Score"]
df_feat = df_feat.drop([c for c in leakage_cols if c in df_feat.columns], axis=1)

# Feature engineering
df_feat["Amount_to_CreditLimit_Ratio"] = df_feat["Transaction_Amount"] / df_feat["Credit_Limit"]
df_feat["Amount_to_Average_Ratio"] = df_feat["Transaction_Amount"] / df_feat["Avg_Transaction_Amount_30D"].replace(0, np.nan)
df_feat["Amount_to_Average_Ratio"] = df_feat["Amount_to_Average_Ratio"].fillna(0)
df_feat["High_Risk_Transaction"] = (df_feat["IP_Risk_Score"] >= 70).astype(int)
df_feat["High_Frequency"] = (df_feat["Transactions_Last_24H"] >= 8).astype(int)

# Drop Transaction_DateTime
if "Transaction_DateTime" in df_feat.columns:
    df_feat = df_feat.drop("Transaction_DateTime", axis=1)

# Preprocessing: Imputation
num_cols = df_feat.select_dtypes(include=["int64","float64","int32","float32","bool"]).columns
for col in num_cols:
    if col != "Is_Fraud":
        df_feat[col] = df_feat[col].fillna(df_feat[col].median())

cat_cols = df_feat.select_dtypes(include=["object","category"]).columns
for col in cat_cols:
    df_feat[col] = df_feat[col].fillna(df_feat[col].mode()[0])

binary_columns = ["VPN_Used","Proxy_Used","Is_Weekend","CVV_Provided","PIN_Used","OTP_Used","Card_Present"]
for col in binary_columns:
    if col in df_feat.columns:
        df_feat[col] = df_feat[col].map({"Yes": 1, "No": 0, True: 1, False: 0}).fillna(0).astype(int)

# Label encoding for remaining object columns
encoders = {}
for col in df_feat.select_dtypes(include=["object","category"]).columns:
    le = LabelEncoder()
    df_feat[col] = le.fit_transform(df_feat[col].astype(str))
    encoders[col] = {str(cls): int(idx) for idx, cls in enumerate(le.classes_)}

# Scaling
scale_columns = [c for c in [
    "Customer_Age","Customer_Income","Credit_Limit","Credit_Score","Account_Age_Months",
    "Card_Tenure_Months","Transaction_Amount","IP_Risk_Score","Transaction_Hour",
    "Previous_Transaction_Gap_Minutes","Transactions_Last_24H","Transactions_Last_7D",
    "Avg_Transaction_Amount_30D","Amount_Deviation_Pct","Distance_From_Last_Transaction_KM",
    "Failed_Authentication_Count","Year","Month","Quarter",
    "Amount_to_CreditLimit_Ratio","Amount_to_Average_Ratio"
] if c in df_feat.columns]

scaler = StandardScaler()
df_feat[scale_columns] = scaler.fit_transform(df_feat[scale_columns])

# Features and target
feature_columns = [c for c in df_feat.columns if c != "Is_Fraud"]
X = df_feat[feature_columns]
y = df_feat["Is_Fraud"]

print(f"X shape: {X.shape}, y shape: {y.shape}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"Train: {X_train.shape}, Test: {X_test.shape}")

models = {
    "Logistic Regression": LogisticRegression(max_iter=2000, class_weight="balanced", random_state=42),
    "Decision Tree": DecisionTreeClassifier(max_depth=10, class_weight="balanced", random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=12, class_weight="balanced", random_state=42, n_jobs=-1)
}

results = {}
for name, m in models.items():
    t0 = time.time()
    m.fit(X_train, y_train)
    y_pred = m.predict(X_test)
    y_prob = m.predict_proba(X_test)[:, 1] if hasattr(m, "predict_proba") else None
    t1 = time.time()
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_prob) if y_prob is not None else 0
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    results[name] = {
        "train_time_sec": round(t1 - t0, 3),
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(auc, 4),
        "confusion_matrix": {
            "tn": cm[0][0], "fp": cm[0][1],
            "fn": cm[1][0], "tp": cm[1][1]
        }
    }
    print(f"[{name}] Acc: {acc:.4f}, Prec: {prec:.4f}, Rec: {rec:.4f}, F1: {f1:.4f}, AUC: {auc:.4f}, Time: {t1-t0:.2f}s")

print("All models successfully trained!")
