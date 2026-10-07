# Credit Card Fraud Analysis & Detection System

A complete, professional, interactive web application for Credit Card Fraud Analysis & Detection built for College Data Analytics & Engineering (DAE) project demonstration and academic evaluation.

---

## 🌟 Executive Summary

- **Primary Source of Truth**: Evaluated directly against `credit_card_fraud_analysis_6plus_years.csv` (22.2 MB, 60,000 raw rows) and `Credit_Card_Fraud_Analysis_DAE_EXACT_REFERENCE_STYLE.html`.
- **Target Feature**: `Is_Fraud` (0 = Legitimate, 1 = Fraudulent).
- **Class Distribution**: 47,768 Legitimate (95.54%) vs. 2,232 Fraudulent (4.46%).
- **Verified Fraud Rate**: 4.46% (1 : 21.4 severe class imbalance ratio).
- **Whitelisted Visualizations**: Strictly implements all 7 visualizations explicitly present in the reference HTML, with zero synthetic or invented charts.
- **Machine Learning**: Preprocessed with `StandardScaler` and `LabelEncoder`, stratified 80:20 train-test split, trained on `LogisticRegression`, `DecisionTreeClassifier`, and `RandomForestClassifier` with `class_weight='balanced'`. Serialized to `credit_card_fraud_model.pkl`.

---

## 📊 The 7 Whitelisted Visualizations (Exact Reference Implementation)

1. **Fraud vs. Legitimate Transactions** (Pie Chart) — Step 6.Basic.1
2. **Distribution of Transaction Amount** (Histogram, 10 Bins) — Step 6.Basic.5
3. **Average Transaction Amount by Fraud Status** (Bar Chart, $3,109.04 vs. $3,781.12) — Step 6.Basic.6
4. **Customer Gender Distribution** (Pie Chart: Male 51.7%, Female 46.3%, Other 2.0%) — Step 6.Customer.1
5. **Fraud Status by Transaction Channel** (Grouped Bar Chart: ATM, Contactless, Mobile App, Online, POS) — Step 6.Fraud.4
6. **Average Transaction Amount by Recent Transaction Frequency** (Line Chart, `Transactions_Last_24H` head 15) — Step 6.Fraud.9
7. **Fraud Rate by Transaction Hour** (Line Chart with Markers, 24-Hour Circadian Curve 00:00 - 23:00) — Step 6.Fraud.10

---

## 🚀 Quick Start Instructions

### Prerequisites
- Node.js (v18+)
- Python 3.10+ (with pandas, scikit-learn, fastapi, uvicorn)

### 1-Click Launch (Windows)
Double-click `run_servers.bat` or run:
```cmd
run_servers.bat
```

### Manual Launch

#### Terminal 1 (Python FastAPI Backend):
```bash
python server.py
# Running on http://127.0.0.1:8000
# API documentation available at http://127.0.0.1:8000/docs
```

#### Terminal 2 (Vite React Frontend):
```bash
npm run dev
# Running on http://localhost:5173
```

---

## 📁 Project Architecture

```
DINESHDAE/
├── credit_card_fraud_analysis_6plus_years.csv      # Real raw dataset (22.2 MB, 60,000 rows)
├── Credit_Card_Fraud_Analysis_DAE_EXACT_REFERENCE_STYLE.html # Official reference source of truth
├── credit_card_fraud_model.pkl                     # Serialized production Random Forest pipeline
├── build_dataset_assets.py                         # Complete data processing & asset generation script
├── server.py                                       # FastAPI live inference & query server
├── run_servers.bat                                 # 1-click execution launcher
├── package.json                                    # React + Vite dependencies
├── vite.config.js                                  # Vite proxy configuration
├── tailwind.config.js                              # Dark navy glassmorphism design tokens
├── public/
│   └── dataset/
│       ├── eda_summary.json                        # Precalculated verified analytics & statistics
│       └── sample_transactions.json                # 500 representative real dataset transactions
└── src/
    ├── main.jsx                                    # React entrypoint
    ├── App.jsx                                     # Root app container & navigation router
    ├── index.css                                   # Tailored dark analytics UI design system
    ├── data/
    │   └── dataService.js                          # Hybrid API client (FastAPI + offline fallback)
    ├── components/
    │   ├── Sidebar.jsx                             # 13-section sticky sidebar navigation
    │   ├── Header.jsx                              # Dynamic header with live dataset indicators
    │   ├── KpiCard.jsx                             # Metric card with glow & badge indicators
    │   ├── SectionHeader.jsx                       # Academic step header
    │   ├── TransactionModal.jsx                    # Record inspection detail viewer
    │   └── PresentationMode.jsx                    # Full-screen college viva presentation deck
    ├── pages/
    │   ├── DashboardPage.jsx                       # 1. Project Dashboard with required KPIs
    │   ├── DatasetOverviewPage.jsx                 # 2. Dimensions, data types & raw data preview
    │   ├── DataExplorationPage.jsx                 # 3. df.describe() & categorical profiling
    │   ├── DataCleaningPage.jsx                    # 4. Step-by-step cleaning flowchart & diffs
    │   ├── CustomerAnalysisPage.jsx                # 5. Customer demographics & financial parity
    │   ├── TransactionAnalysisPage.jsx             # 6. Amount distribution & velocity curves
    │   ├── FraudAnalysisPage.jsx                   # 7. Dedicated fraud diagnostics & crosstabs
    │   ├── DataVisualizationPage.jsx               # 8. All 7 Whitelist Charts with Python code
    │   ├── MachineLearningPage.jsx                 # 9. Real-time inference engine & presets
    │   ├── ModelEvaluationPage.jsx                 # 10. Benchmarking & Confusion Matrices
    │   ├── TransactionExplorerPage.jsx             # 11. Multi-faceted searchable transaction table
    │   ├── MethodologyPage.jsx                     # 12. 12-phase project lifecycle
    │   └── ConclusionPage.jsx                      # 13. Academic conclusions & takeaways
    └── charts/
        ├── FraudDistributionPieChart.jsx           # Chart 1
        ├── AmountHistogramChart.jsx                # Chart 2
        ├── AmountByFraudBarChart.jsx               # Chart 3
        ├── GenderDistributionPieChart.jsx          # Chart 4
        ├── ChannelFraudBarChart.jsx                # Chart 5
        ├── VelocityAmountLineChart.jsx             # Chart 6
        ├── HourlyFraudLineChart.jsx                # Chart 7
        └── ConfusionMatrixView.jsx                 # Interactive Confusion Matrix visualizer
```

---

## 🎯 Academic Viva Defense Key Highlights

1. **Why was Accuracy misleading in this project?**
   - With a 4.46% fraud rate, a trivial model predicting "All Legitimate" achieves **95.54% accuracy** while detecting zero fraudulent transactions. Therefore, **Recall** and **F1-Score** are the decisive metrics.
2. **Why drop the bottom 10,000 rows?**
   - The bottom 10,000 rows were legacy prototype rows lacking the target label (`Is_Fraud = NaN`). Synthesizing labels would compromise academic ground truth.
3. **What prevented Information Leakage?**
   - Attributes like `Alert_Generated`, `Risk_Score`, and `Chargeback` are post-investigation variables generated by fraud ops. Removing them prevents artificial, unrepeatable 100% test accuracy.
