import pandas as pd
import numpy as np
import json
import time

print("Loading dataset...")
start_time = time.time()
df = pd.read_csv("credit_card_fraud_analysis_6plus_years.csv", low_memory=False)
print(f"Loaded {len(df)} rows, {len(df.columns)} columns in {time.time() - start_time:.2f}s")

# Check legacy columns
legacy_columns = ["transaction_id","amount","transaction_hour","merchant_category","foreign_transaction","location_mismatch","device_trust_score","velocity_last_24h","cardholder_age","is_fraud"]
df_cleaned = df.drop(columns=[c for c in legacy_columns if c in df.columns])

# Check Is_Fraud
df_cleaned["Is_Fraud"] = pd.to_numeric(df_cleaned["Is_Fraud"], errors="coerce")
valid_mask = df_cleaned["Is_Fraud"].notna()
print(f"Valid Is_Fraud rows: {valid_mask.sum()} out of {len(df_cleaned)}")
vc = df_cleaned["Is_Fraud"].value_counts().to_dict()
print(f"Is_Fraud value counts: {vc}")

print("Done basic check.")
