import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Presentation, Award, BookOpen, CheckCircle, Database, ShieldAlert, Cpu } from 'lucide-react';

export default function PresentationMode({ isOpen, onClose, summaryData }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen || !summaryData) return null;

  const kpis = summaryData.kpis || {};
  const dataset = summaryData.dataset_info || {};
  const models = summaryData.model_evaluation?.models || {};

  const slides = [
    {
      title: "CREDIT CARD FRAUD ANALYSIS & DETECTION",
      tag: "PROJECT OVERVIEW & MOTIVATION",
      subtitle: "Data Analytics & Engineering (DAE) Academic Viva Demonstration",
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 text-center space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-cyan-300">
              "Analyzing transaction patterns to identify suspicious and fraudulent activity."
            </h3>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              A comprehensive end-to-end data analytics and machine learning pipeline for detecting financial fraud across multi-channel credit card transactions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <span className="text-xs uppercase text-slate-400 font-medium">Cleaned Transactions</span>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">{kpis.total_transactions?.toLocaleString()}</p>
              <span className="text-[11px] text-cyan-400">From 60K Raw CSV</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <span className="text-xs uppercase text-slate-400 font-medium">Fraudulent Records</span>
              <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">{kpis.fraudulent_transactions?.toLocaleString()}</p>
              <span className="text-[11px] text-rose-300">Verified Target Label</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <span className="text-xs uppercase text-slate-400 font-medium">Dataset Fraud Rate</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{kpis.fraud_rate_pct}%</p>
              <span className="text-[11px] text-amber-300">Extreme Class Imbalance</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <span className="text-xs uppercase text-slate-400 font-medium">Models Trained</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">3</p>
              <span className="text-[11px] text-emerald-300">RF, LR, Decision Tree</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "DATASET SCHEMA & NORMALIZATION",
      tag: "STEP 1 - 4: DATA PROVENANCE & CLEANING",
      subtitle: "Handling legacy schemas, mixed data types, and target standardization",
      content: (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" /> Two-Tier Schema Resolution
            </h4>
            <p className="text-slate-300 leading-relaxed">
              The original CSV contained <strong>60,000 raw rows</strong> with 69 columns, containing a legacy 10,000-row prototype block at the bottom with lowercase headers (<code className="text-cyan-300 font-mono">is_fraud, amount, velocity_last_24h...</code>) missing the full modern schema.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
              <h5 className="font-bold text-rose-300">1. Legacy &amp; Incomplete Field Handling</h5>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                <li>Dropped 10 legacy lowercase columns: <code className="font-mono text-slate-200">transaction_id, is_fraud, amount...</code></li>
                <li>Identified 10,000 rows lacking the target label <code className="font-mono text-slate-200">Is_Fraud</code> and safely dropped them.</li>
                <li>Standardized <code className="font-mono text-cyan-300">Is_Fraud</code> to binary [0: Legitimate (47,768), 1: Fraud (2,232)].</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
              <h5 className="font-bold text-emerald-300">2. Leakage Prevention &amp; Imputation</h5>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                <li>Removed 6 ID attributes to prevent memorization overfitting (<code className="font-mono">Transaction_ID, Customer_ID...</code>).</li>
                <li>Removed 7 post-transaction leakage columns (<code className="font-mono">Risk_Score, Alert_Generated, Chargeback...</code>).</li>
                <li>Applied median imputation for numeric variables and mode for categoricals.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "FEATURE ENGINEERING ARCHITECTURE",
      tag: "STEP 5: MATHEMATICAL FEATURE DERIVATION",
      subtitle: "Creating domain-grounded fraud indicators before machine learning",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Four specialized engineered features were constructed according to the exact project reference implementation:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <span className="font-mono text-cyan-400 font-bold text-sm">Amount_to_CreditLimit_Ratio</span>
              <p className="text-slate-300">
                Formula: <code className="text-slate-100 font-mono">Transaction_Amount / Credit_Limit</code>
              </p>
              <p className="text-slate-400">
                Measures card credit utilization per single swipe. Large ratios indicate sudden credit-limit maxing out by fraudsters.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <span className="font-mono text-cyan-400 font-bold text-sm">Amount_to_Average_Ratio</span>
              <p className="text-slate-300">
                Formula: <code className="text-slate-100 font-mono">Transaction_Amount / Avg_Transaction_Amount_30D</code>
              </p>
              <p className="text-slate-400">
                Captures spending deviation compared to the cardholder's historical 30-day baseline. Values &gt;3.0x represent massive anomalies.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <span className="font-mono text-cyan-400 font-bold text-sm">High_Risk_Transaction</span>
              <p className="text-slate-300">
                Formula: <code className="text-slate-100 font-mono">IP_Risk_Score &gt;= 70</code>
              </p>
              <p className="text-slate-400">
                Flag for connection origins tied to compromised subnets, malicious botnets, or known fraud proxies.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <span className="font-mono text-cyan-400 font-bold text-sm">High_Frequency</span>
              <p className="text-slate-300">
                Formula: <code className="text-slate-100 font-mono">Transactions_Last_24H &gt;= 8</code>
              </p>
              <p className="text-slate-400">
                Captures velocity attacks where stolen credentials are repeatedly drained in rapid succession.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "EXPLORATORY DATA ANALYSIS FINDINGS",
      tag: "STEP 6: KEY STATISTICAL INSIGHTS",
      subtitle: "Quantified patterns from the 7 verified whitelist visualizations",
      content: (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <h5 className="font-bold text-cyan-400 text-sm">1. Amount Disparity</h5>
              <p className="text-slate-300">
                Legitimate average: <strong>${kpis.legit_avg_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong><br />
                Fraudulent average: <strong className="text-rose-400">${kpis.fraud_avg_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                Fraudulent transactions average <strong>21.6% higher</strong> monetary values as fraudsters attempt to maximize payout before account freeze.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <h5 className="font-bold text-amber-400 text-sm">2. Channel &amp; Device Patterns</h5>
              <p className="text-slate-300">
                POS: <strong>4.68%</strong> fraud rate<br />
                Contactless: <strong>4.55%</strong> fraud rate<br />
                Mobile App: <strong>3.99%</strong> fraud rate
              </p>
              <p className="text-[11px] text-slate-400">
                Physical POS terminal and Card-Not-Present e-commerce represent the bulk of transaction fraud volume.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <h5 className="font-bold text-rose-400 text-sm">3. Hourly Vulnerability</h5>
              <p className="text-slate-300">
                Peak fraud occurs between <strong>01:00 and 05:00</strong> local time.
              </p>
              <p className="text-[11px] text-slate-400">
                Late night/early morning hours coincide with victim inactivity, delaying SMS OTP alerts and detection.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "MODEL EVALUATION & BENCHMARKING",
      tag: "STEP 9 - 10: MACHINE LEARNING METRICS",
      subtitle: "Comparing Logistic Regression, Decision Tree, and Random Forest on 10,000 Test Records",
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800/80 text-slate-300 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Classifier</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Precision</th>
                  <th className="py-2.5 px-3">Recall</th>
                  <th className="py-2.5 px-3">F1-Score</th>
                  <th className="py-2.5 px-3">ROC AUC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {Object.entries(models).map(([name, m]) => (
                  <tr key={name} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-sans font-bold text-white">{name}</td>
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">{m.accuracy_pct}%</td>
                    <td className="py-2.5 px-3">{m.precision}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{m.recall_pct}%</td>
                    <td className="py-2.5 px-3 font-bold text-amber-300">{m.f1_score}</td>
                    <td className="py-2.5 px-3">{m.roc_auc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
            <h5 className="font-bold text-cyan-400">Critical Academic Defense Note:</h5>
            <p>
              In highly imbalanced domains (4.46% fraud), a naive model predicting 100% legitimate achieves <strong>95.54% accuracy</strong> while catching 0 frauds!
              Therefore, <strong>Recall</strong> (capturing actual fraud) and <strong>F1-Score</strong> are the decisive engineering metrics rather than accuracy alone.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "COLLEGE VIVA DEFENSE QUESTIONS & ANSWERS",
      tag: "VIVA EXAMINATION PREPARATION",
      subtitle: "Anticipated questions from the external examiner / evaluation committee",
      content: (
        <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700 space-y-1">
            <p className="font-bold text-cyan-300">Q1: Why did you drop the 10,000 legacy rows?</p>
            <p className="text-slate-300">
              The bottom 10,000 rows belonged to a deprecated legacy prototype schema without valid target labels (<code className="font-mono">Is_Fraud = NaN</code>) and missing 48 modern production features. Imputing the target would fabricate ground truth.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700 space-y-1">
            <p className="font-bold text-cyan-300">Q2: Why did you remove 'Alert_Generated' and 'Risk_Score' before model training?</p>
            <p className="text-slate-300">
              Those features represent <strong>Information Leakage</strong>. They are generated downstream by fraud investigation units after a transaction is flagged. Including them produces artificial 100% accuracy during training that fails completely in real-world deployment.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700 space-y-1">
            <p className="font-bold text-cyan-300">Q3: How was class imbalance handled?</p>
            <p className="text-slate-300">
              We configured <code className="font-mono text-cyan-300">class_weight='balanced'</code> in both Logistic Regression, Decision Tree, and Random Forest, which penalizes false negatives inversely proportional to class frequencies.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700 space-y-1">
            <p className="font-bold text-cyan-300">Q4: Why was Random Forest selected for serialization?</p>
            <p className="text-slate-300">
              Random Forest provides ensemble bagging robustness across non-linear feature interactions (such as IP risk + velocity + credit utilization) without overfitting individual decision thresholds.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "PROJECT CONCLUSION & RECOMMENDATIONS",
      tag: "STEP 13: STRATEGIC RECOMMENDATIONS",
      subtitle: "Key takeaways and practical deployment strategy for financial institutions",
      content: (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <h5 className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Core Technical Achievements
              </h5>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                <li>Processed 50,000 real-world records without synthetic fabrication.</li>
                <li>Faithfully matched all 7 whitelist visualizations from the reference HTML.</li>
                <li>Built real-time interactive inference playground using serialized <code className="font-mono">.pkl</code> model.</li>
                <li>Created searchable transaction explorer with multi-dimensional filtering.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <h5 className="font-bold text-cyan-400 text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Banking Implementation Road-map
              </h5>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                <li>Deploy sub-100ms async scoring engine at payment gateway ingress.</li>
                <li>Trigger mandatory step-up biometric authentication for night-time high-velocity swipes.</li>
                <li>Institute dynamic velocity throttles on cards exceeding 8 swipes in 24 hours.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[88vh] bg-navy-900 border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                {slide.tag}
              </span>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                {slide.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold text-slate-400">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Body */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto flex flex-col justify-center">
          <div className="max-w-4xl mx-auto w-full">
            <p className="text-xs sm:text-sm text-cyan-400 font-medium mb-6">
              {slide.subtitle}
            </p>
            {slide.content}
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="px-6 py-3.5 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
            disabled={currentSlide === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-navy-950 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 transition-all"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
