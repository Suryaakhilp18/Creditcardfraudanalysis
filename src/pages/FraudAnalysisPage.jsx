import React from 'react';
import { ShieldAlert, ShieldCheck, Clock, Radio, Smartphone, Lock, AlertTriangle } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ChannelFraudBarChart from '../charts/ChannelFraudBarChart';
import HourlyFraudLineChart from '../charts/HourlyFraudLineChart';
import FraudDistributionPieChart from '../charts/FraudDistributionPieChart';

export default function FraudAnalysisPage({ summaryData }) {
  if (!summaryData) return null;

  const kpis = summaryData.kpis || {};
  const charts = summaryData.charts || {};
  const tables = summaryData.tables || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      <SectionHeader
        stepNumber="Step 6.Fraud"
        title="Dedicated Fraud Analysis &amp; Vector Diagnostics"
        subtitle="In-depth examination of fraud concentration by transaction channels, temporal hourly velocity, card authentication protocols, and device risk vectors."
        badge="Class Imbalance: 4.46%"
      />

      {/* Fraud Volume Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-6 border border-emerald-900/40 bg-emerald-950/15 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
            <span>LEGITIMATE TRANSACTIONS</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-white font-mono">{kpis.legitimate_transactions?.toLocaleString()}</p>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Volume Share</span>
            <strong className="text-emerald-300 font-mono">{(100 - kpis.fraud_rate_pct).toFixed(2)}%</strong>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-rose-900/40 bg-rose-950/15 space-y-2">
          <div className="flex items-center justify-between text-xs text-rose-400 font-bold uppercase tracking-wider">
            <span>FRAUDULENT TRANSACTIONS</span>
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-rose-400 font-mono">{kpis.fraudulent_transactions?.toLocaleString()}</p>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Fraud Incidence</span>
            <strong className="text-rose-300 font-mono">{kpis.fraud_rate_pct}%</strong>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-cyan-900/40 bg-cyan-950/15 space-y-2">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-bold uppercase tracking-wider">
            <span>EXACT CLASS IMBALANCE</span>
            <AlertTriangle className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-cyan-300 font-mono">1 : 21.4</p>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Exact Mean Fraction</span>
            <strong className="text-cyan-300 font-mono">{kpis.exact_fraud_pct}%</strong>
          </div>
        </div>
      </div>

      {/* Whitelist Chart 5: Channel Fraud Bar Chart */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
              Whitelist Chart 5 (Ref: Step 6.Fraud.4)
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Fraud Status by Transaction Channel (Crosstab Visualizer)
            </h3>
          </div>
          <span className="badge badge-fraud">Channel Crosstab</span>
        </div>

        <ChannelFraudBarChart data={charts.channel_fraud} />

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
          <strong className="text-cyan-400">Reference Observation:</strong>{' '}
          Online transactions contribute the largest gross count of fraudulent events (794 instances), but Point-of-Sale (POS) transactions carry the highest relative fraud risk at <strong>4.68%</strong> (725 fraud out of 15,501 swipes).
        </div>
      </div>

      {/* Whitelist Chart 7: Fraud Rate by Transaction Hour */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">
              Whitelist Chart 7 (Ref: Step 6.Fraud.10)
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Fraud Rate by Transaction Hour (24-Hour Circadian Curve)
            </h3>
          </div>
          <span className="badge badge-fraud flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Hourly Vulnerability
          </span>
        </div>

        <HourlyFraudLineChart data={charts.hourly_fraud_rate} />

        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs text-slate-300 space-y-1">
          <strong className="text-rose-400">Circadian Attack Pattern:</strong>{' '}
          The hourly fraud percentage peaks sharply during the late night and early morning hours (01:00 to 05:00). 
          This confirms that syndicates exploit automated scripts and batch card runs while genuine cardholders are dormant.
        </div>
      </div>

      {/* Authentication Method & Device Type Crosstabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auth Method Crosstab */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" /> Authentication Method vs Fraud
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">pd.crosstab(df["Authentication_Method"])</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-2 px-3">Method</th>
                  <th className="py-2 px-3 text-right">Legit</th>
                  <th className="py-2 px-3 text-right">Fraud</th>
                  <th className="py-2 px-3 text-right">Total</th>
                  <th className="py-2 px-3 text-right">Fraud Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {tables.authentication_method?.map((a) => (
                  <tr key={a.auth_method} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 font-sans font-medium text-slate-200">{a.auth_method}</td>
                    <td className="py-2 px-3 text-right text-slate-300">{a.legitimate.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-rose-400 font-bold">{a.fraud.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-400">{a.total.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-bold text-amber-300">{a.fraud_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Device Type Crosstab */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-amber-400" /> Device Type vs Fraud
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">pd.crosstab(df["Device_Type"])</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-2 px-3">Device Type</th>
                  <th className="py-2 px-3 text-right">Legit</th>
                  <th className="py-2 px-3 text-right">Fraud</th>
                  <th className="py-2 px-3 text-right">Total</th>
                  <th className="py-2 px-3 text-right">Fraud Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {tables.device_type?.map((d) => (
                  <tr key={d.device_type} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 font-sans font-medium text-slate-200">{d.device_type}</td>
                    <td className="py-2 px-3 text-right text-slate-300">{d.legitimate.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-rose-400 font-bold">{d.fraud.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-400">{d.total.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-bold text-amber-300">{d.fraud_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
