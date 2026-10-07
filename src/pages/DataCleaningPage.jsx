import React from 'react';
import { Sparkles, ArrowDown, Database, Trash2, CheckCircle2, ShieldCheck, Filter, AlertTriangle, Code2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

export default function DataCleaningPage({ summaryData }) {
  if (!summaryData) return null;

  const dataset = summaryData.dataset_info || {};
  const kpis = summaryData.kpis || {};

  const pipelineSteps = [
    {
      step: 1,
      title: "Raw CSV Ingestion",
      count: "60,000 rows × 69 columns",
      badge: "Initial State",
      badgeColor: "bg-slate-800 text-slate-300 border-slate-700",
      description: "Loaded 22.2 MB raw file containing multi-year credit card transaction and cardholder behavioral records.",
      code: `df = pd.read_csv("credit_card_fraud_analysis_6plus_years.csv", low_memory=False)`
    },
    {
      step: 2,
      title: "Legacy Schema Normalization",
      count: "-10 Columns Dropped",
      badge: "Deprecation Cleanup",
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
      description: "Detected and removed 10 deprecated lowercase prototype columns appended at the bottom of the raw dataset.",
      code: `legacy_columns = ["transaction_id","amount","transaction_hour","merchant_category","foreign_transaction","location_mismatch","device_trust_score","velocity_last_24h","cardholder_age","is_fraud"]\ndf = df.drop(columns=[c for c in legacy_columns if c in df.columns])`
    },
    {
      step: 3,
      title: "Target Standardization (Is_Fraud)",
      count: "-10,000 Incomplete Records",
      badge: "Target Ground Truth",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      description: "Converted Is_Fraud to clean binary numeric [0: Legitimate, 1: Fraud]. Dropped 10,000 rows where target was null.",
      code: `df["Is_Fraud"] = pd.to_numeric(df["Is_Fraud"], errors="coerce")\nvalid_rows = df["Is_Fraud"].notna()\ndf = df.loc[valid_rows]\ndf["Is_Fraud"] = df["Is_Fraud"].astype(int)`
    },
    {
      step: 4,
      title: "Missing Value Imputation",
      count: "0 Null Values Remaining",
      badge: "Statistical Imputation",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      description: "Imputed Customer_Gender mode ('Male'), numerical medians, and categorical modes across features.",
      code: `mode_gender = df["Customer_Gender"].mode()[0]\ndf["Customer_Gender"] = df["Customer_Gender"].fillna(mode_gender)\n# Numeric median & categorical mode imputation across remaining attributes`
    },
    {
      step: 5,
      title: "Information Leakage & ID Removal",
      count: "-13 Non-Predictive Columns",
      badge: "Overfitting Prevention",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      description: "Removed 6 arbitrary IDs (Customer_ID, Card_ID...) and 7 post-incident leakage columns (Risk_Score, Chargeback, Alert_Generated...).",
      code: `df = df.drop(["Transaction_ID","Customer_ID","Card_ID","Merchant_ID","Device_ID","IP_Address"], axis=1)\ndf = df.drop(["Fraud_Type","Fraud_Detection_Method","Fraud_Probability","Transaction_Status","Chargeback","Alert_Generated","Risk_Score"], axis=1)`
    },
    {
      step: 6,
      title: "Feature Engineering & Scaling",
      count: "+4 Derived Features Created",
      badge: "Domain Feature Synthesis",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      description: "Engineered Amount_to_CreditLimit_Ratio, Amount_to_Average_Ratio, High_Risk_Transaction, and High_Frequency. Applied StandardScaler and LabelEncoder.",
      code: `df["Amount_to_CreditLimit_Ratio"] = df["Transaction_Amount"] / df["Credit_Limit"]\ndf["Amount_to_Average_Ratio"] = df["Transaction_Amount"] / df["Avg_Transaction_Amount_30D"].replace(0, np.nan)\ndf["High_Risk_Transaction"] = df["IP_Risk_Score"] >= 70\ndf["High_Frequency"] = df["Transactions_Last_24H"] >= 8`
    },
    {
      step: 7,
      title: "Final Cleaned Dataset",
      count: "50,000 rows × 48 features",
      badge: "Production Ready",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/50",
      description: "Verified 50,000 transaction instances (47,768 legitimate, 2,232 fraudulent, 4.46% fraud rate) ready for machine learning.",
      code: `# Shape: (50000, 48) features + 1 target\n# Stratified 80:20 Train-Test Split (40,000 train / 10,000 test)`
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <SectionHeader
        stepNumber="Step 4 &amp; 5"
        title="Data Cleaning, Normalization &amp; Feature Engineering"
        subtitle="End-to-end data transformation pipeline reproducing the exact reference code from the project notebook."
        badge="Zero Synthetic Data"
      />

      {/* Before / After Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-rose-900/40 bg-rose-950/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
              Raw Input State (CSV)
            </span>
            <span className="badge badge-fraud">Uncleaned</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Total Rows</span>
              <p className="text-2xl font-bold text-white mt-1">60,000</p>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Total Columns</span>
              <p className="text-2xl font-bold text-white mt-1">69</p>
            </div>
          </div>

          <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
            <li className="flex items-center gap-1.5 text-rose-300">
              <AlertTriangle className="w-3.5 h-3.5" /> 10,000 deprecated prototype rows lacking target
            </li>
            <li className="flex items-center gap-1.5 text-rose-300">
              <AlertTriangle className="w-3.5 h-3.5" /> 10 legacy lowercase columns
            </li>
            <li className="flex items-center gap-1.5 text-rose-300">
              <AlertTriangle className="w-3.5 h-3.5" /> Post-transaction leakage variables present
            </li>
          </ul>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-emerald-900/40 bg-emerald-950/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Cleaned &amp; Engineered State
            </span>
            <span className="badge badge-legit">Production Standard</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Verified Rows</span>
              <p className="text-2xl font-bold text-emerald-300 mt-1">50,000</p>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Engineered Features</span>
              <p className="text-2xl font-bold text-emerald-300 mt-1">48</p>
            </div>
          </div>

          <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
            <li className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% verified ground truth labels (47,768 vs 2,232)
            </li>
            <li className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> 4 domain-derived fraud risk features synthesized
            </li>
            <li className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Scaled, encoded, and zero data leakage
            </li>
          </ul>
        </div>
      </div>

      {/* Visual Pipeline Flowchart */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider">
          Sequential Cleaning &amp; Feature Normalization Pipeline
        </h3>

        <div className="space-y-4">
          {pipelineSteps.map((step, idx) => (
            <div key={step.step} className="relative">
              <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center border border-cyan-500/40">
                      {step.step}
                    </span>
                    <h4 className="text-base font-bold text-white">{step.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      {step.count}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${step.badgeColor}`}>
                      {step.badge}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>

                {step.code && (
                  <div className="rounded-xl bg-slate-950 p-3 font-mono text-[11px] text-cyan-300/90 overflow-x-auto border border-slate-900">
                    <pre>{step.code}</pre>
                  </div>
                )}
              </div>

              {idx < pipelineSteps.length - 1 && (
                <div className="flex justify-center my-1.5">
                  <ArrowDown className="w-5 h-5 text-cyan-500/60" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
