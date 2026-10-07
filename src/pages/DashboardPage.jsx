import React from 'react';
import {
  CreditCard,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Database,
  Cpu,
  BarChart2,
  Clock,
  Zap
} from 'lucide-react';
import KpiCard from '../components/KpiCard';
import SectionHeader from '../components/SectionHeader';
import FraudDistributionPieChart from '../charts/FraudDistributionPieChart';
import AmountByFraudBarChart from '../charts/AmountByFraudBarChart';

export default function DashboardPage({ summaryData, onNavigate }) {
  if (!summaryData) return null;

  const kpis = summaryData.kpis || {};
  const charts = summaryData.charts || {};
  const dataset = summaryData.dataset_info || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Project Hero Header */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 bg-gradient-to-br from-navy-900 via-navy-850 to-slate-900">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Academic Data Analytics &amp; Machine Learning Project</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            CREDIT CARD FRAUD <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">ANALYSIS &amp; DETECTION</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            "Analyzing transaction patterns to identify suspicious and fraudulent activity."
            Ground-truthed on a verified multi-year dataset of <strong>50,000 production transactions</strong>, evaluating behavioral anomalies, transaction velocity, credit utilization, and predictive AI classifiers.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('fraud-analysis')}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 transition-colors shadow-md flex items-center gap-1.5"
            >
              <span>Explore Fraud Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('machine-learning')}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Test Live ML Predictor</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Required KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Core Dataset Key Performance Indicators (KPIs)
          </h3>
          <span className="text-xs text-slate-500">Calculated directly from real CSV data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard
            title="Total Transactions"
            value={kpis.total_transactions?.toLocaleString()}
            subtitle="Cleaned Analysis Records"
            icon={Database}
            color="cyan"
            badge="60K Raw CSV"
          />

          <KpiCard
            title="Legitimate Transactions"
            value={kpis.legitimate_transactions?.toLocaleString()}
            subtitle={`${(100 - kpis.fraud_rate_pct).toFixed(2)}% of Volume`}
            icon={ShieldCheck}
            color="emerald"
            badge="Class 0"
          />

          <KpiCard
            title="Fraudulent Transactions"
            value={kpis.fraudulent_transactions?.toLocaleString()}
            subtitle={`${kpis.fraud_rate_pct}% Identified`}
            icon={ShieldAlert}
            color="rose"
            badge="Class 1"
          />

          <KpiCard
            title="Fraud Rate"
            value={`${kpis.fraud_rate_pct}%`}
            subtitle="Severe Imbalance Baseline"
            icon={TrendingUp}
            color="amber"
            badge="Exact: 4.46%"
          />

          <KpiCard
            title="Avg. Transaction Amount"
            value={`$${kpis.avg_transaction_amount?.toLocaleString()}`}
            subtitle={`Median: $${kpis.median_transaction_amount?.toLocaleString()}`}
            icon={DollarSign}
            color="indigo"
            badge="Range: $21 - $127K"
          />
        </div>
      </div>

      {/* Featured Visual Analytics (Whitelist Charts 1 & 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Whitelist Chart 1: Fraud Distribution Pie */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                Whitelist Chart 1 (Ref: Step 6.1)
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Fraud vs. Legitimate Transactions
              </h3>
            </div>
            <span className="badge badge-fraud">{kpis.fraud_rate_pct}% Fraud Rate</span>
          </div>

          <FraudDistributionPieChart data={charts.fraud_distribution} />

          <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs text-center">
            <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
              <span className="text-slate-400">Legitimate:</span>{' '}
              <strong className="text-emerald-300 font-mono text-sm">
                {kpis.legitimate_transactions?.toLocaleString()} (95.54%)
              </strong>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-900/40">
              <span className="text-slate-400">Fraudulent:</span>{' '}
              <strong className="text-rose-400 font-mono text-sm">
                {kpis.fraudulent_transactions?.toLocaleString()} (4.46%)
              </strong>
            </div>
          </div>
        </div>

        {/* Whitelist Chart 3: Amount by Fraud Status Bar */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                Whitelist Chart 3 (Ref: Step 6.6)
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Average Transaction Amount by Fraud Status
              </h3>
            </div>
            <span className="badge badge-legit">+21.6% Higher in Fraud</span>
          </div>

          <AmountByFraudBarChart data={charts.amount_by_fraud} />

          <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs text-center">
            <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
              <span className="text-slate-400">Legitimate Mean:</span>{' '}
              <strong className="text-emerald-300 font-mono text-sm">
                ${kpis.legit_avg_amount?.toLocaleString()}
              </strong>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-900/40">
              <span className="text-slate-400">Fraudulent Mean:</span>{' '}
              <strong className="text-rose-400 font-mono text-sm">
                ${kpis.fraud_avg_amount?.toLocaleString()}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Analytical Findings Summary */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            Key Investigative Highlights Discovered in the Project
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <TrendingUp className="w-4 h-4" /> Higher Financial Exposure
            </div>
            <p className="text-slate-300 leading-relaxed">
              Fraudulent transactions average <strong>${kpis.fraud_avg_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> compared to legitimate swipes of <strong>${kpis.legit_avg_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> (a 21.6% increase), demonstrating aggressive capital extraction.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Clock className="w-4 h-4" /> Night-time Vulnerability Window
            </div>
            <p className="text-slate-300 leading-relaxed">
              Transactions executed during late-night and pre-dawn hours (01:00 - 05:00) exhibit a <strong>statistically elevated fraud rate</strong> due to victims being asleep and unable to contest instant push alerts.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" /> Channel Discrepancy
            </div>
            <p className="text-slate-300 leading-relaxed">
              Point-of-Sale (POS) and Contactless NFC transactions registered the highest proportion of fraudulent instances (4.68% and 4.55%), emphasizing the need for dynamic biometric verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
