import React from 'react';
import { GitBranch, Database, FileSearch, Sparkles, Sliders, BarChart, Split, Cpu, Award, Lightbulb, ArrowDown } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

export default function MethodologyPage() {
  const steps = [
    {
      num: "01",
      icon: Database,
      name: "Dataset Collection & Ingestion",
      desc: "Gathered credit card financial records spanning 6+ years with 69 raw attributes capturing customer demographics, card properties, merchant geolocation, authentication telemetry, and risk metrics.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      num: "02",
      icon: FileSearch,
      name: "Data Loading & Schema Validation",
      desc: "Imported 60,000 raw rows using pandas. Diagnosed mixed data type warnings and detected 10 deprecated lowercase prototype columns requiring normalization.",
      color: "from-cyan-500 to-teal-500"
    },
    {
      num: "03",
      icon: FileSearch,
      name: "Data Exploration & Profiling",
      desc: "Ran df.shape (60,000, 69), df.info(), df.describe(), and categorical frequencies to map missing values, distributions, and domain range limits.",
      color: "from-teal-500 to-emerald-500"
    },
    {
      num: "04",
      icon: Sparkles,
      name: "Data Cleaning & Target Standardization",
      desc: "Dropped 10 legacy columns, isolated 50,000 records with verified Is_Fraud labels (47,768 legit, 2,232 fraud), and performed statistical mode and median imputations.",
      color: "from-emerald-500 to-green-500"
    },
    {
      num: "05",
      icon: Sliders,
      name: "Feature Engineering & Leakage Removal",
      desc: "Removed 6 arbitrary IDs and 7 post-incident leakage fields (Alert_Generated, Risk_Score, Chargeback). Synthesized 4 new features: credit utilization, average spend ratio, IP risk flag, and velocity surge flag.",
      color: "from-green-500 to-amber-500"
    },
    {
      num: "06",
      icon: BarChart,
      name: "Exploratory Data Analysis (EDA)",
      desc: "Produced the 7 official whitelist visualizations covering target imbalance (4.46%), Pareto amount distribution, +21.6% fraud spread, channel crosstabs, velocity trends, and hourly vulnerability spikes.",
      color: "from-amber-500 to-orange-500"
    },
    {
      num: "07",
      icon: Sliders,
      name: "Data Preprocessing & Scaling",
      desc: "Encoded categoricals using LabelEncoder, mapped binary flags to 1/0, and applied StandardScaler to all 21 continuous features to equalize gradient variance.",
      color: "from-orange-500 to-rose-500"
    },
    {
      num: "08",
      icon: Split,
      name: "Stratified Train / Test Split",
      desc: "Partitioned 50,000 records into 80% Training (40,000 samples) and 20% Testing (10,000 samples) maintaining exact 4.46% class distribution across both sets (stratify=y, random_state=42).",
      color: "from-rose-500 to-purple-500"
    },
    {
      num: "09",
      icon: Cpu,
      name: "Model Training & Class Balancing",
      desc: "Trained Logistic Regression (max_iter=2000), Decision Tree (max_depth=10), and Random Forest (100 estimators) configuring class_weight='balanced' to prevent majority class collapse.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      num: "10",
      icon: Award,
      name: "Model Evaluation & Benchmarking",
      desc: "Evaluated 10,000 unseen test records across Accuracy, Precision, Recall, F1-Score, and Confusion Matrix grids. Proved that Recall is the primary metric for fraud mitigation.",
      color: "from-indigo-500 to-cyan-500"
    },
    {
      num: "11",
      icon: Database,
      name: "Model Serialization (.pkl)",
      desc: "Serialized the trained Random Forest pipeline along with feature transformers, scalers, and encoders into credit_card_fraud_model.pkl for instant deployment.",
      color: "from-cyan-500 to-blue-500"
    },
    {
      num: "12",
      icon: Lightbulb,
      name: "Fraud Detection Insights & Deployment",
      desc: "Created real-time inference engine and automated ruleset recommendations for payment gateway throttles, step-up biometric checks, and velocity caps.",
      color: "from-blue-500 to-emerald-500"
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <SectionHeader
        stepNumber="Step 12"
        title="Project Methodology &amp; Engineering Pipeline"
        subtitle="Complete chronological data science lifecycle mapped directly from data collection to real-world fraud detection inference."
        badge="12 Lifecycle Phases"
      />

      {/* Visual Pipeline Flowchart */}
      <div className="relative space-y-4 max-w-4xl mx-auto">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="relative">
              <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${s.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Icon className="w-6 h-6 text-navy-950 font-bold" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">PHASE {s.num}</span>
                    <h4 className="text-base font-bold text-white">{s.name}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="flex justify-center my-1">
                  <ArrowDown className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
