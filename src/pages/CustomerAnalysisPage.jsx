import React from 'react';
import { Users, CreditCard, Smartphone, DollarSign, Award, Layers } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import GenderDistributionPieChart from '../charts/GenderDistributionPieChart';

export default function CustomerAnalysisPage({ summaryData }) {
  if (!summaryData) return null;

  const kpis = summaryData.kpis || {};
  const charts = summaryData.charts || {};
  const tables = summaryData.tables || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      <SectionHeader
        stepNumber="Step 6.2"
        title="Customer Demographics &amp; Portfolio Analysis"
        subtitle="Evaluating customer gender proportions, card product portfolios, device usage, and income/credit-score parity between legitimate and fraudulent cardholders."
        badge="Reference HTML Implementation"
      />

      {/* Customer Financial Parity KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
            <span>Legit Customer Income</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">${kpis.legit_avg_income?.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-400">Mean Annual Income</span>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
            <span>Fraud Customer Income</span>
            <DollarSign className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-extrabold text-rose-300">${kpis.fraud_avg_income?.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Parity Difference: -$38</span>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
            <span>Legit Credit Score</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{kpis.legit_avg_credit_score}</p>
          <span className="text-[11px] text-emerald-400">Good Credit Standing</span>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
            <span>Fraud Credit Score</span>
            <Award className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{kpis.fraud_avg_credit_score}</p>
          <span className="text-[11px] text-slate-400">Virtually Identical: 720.97</span>
        </div>
      </div>

      {/* Key Observation Alert */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-slate-300 leading-relaxed">
        <strong className="text-cyan-400">Key Academic Finding from df.groupby("Is_Fraud")["Customer_Income"]:</strong>{' '}
        Customer income ($75,663 vs $75,625) and credit scores (719.77 vs 720.97) show <strong>almost zero divergence</strong> between legitimate and fraudulent transactions.
        This proves that fraudsters compromise accounts across all socioeconomic tiers, and static demographic credit scores cannot serve as standalone fraud predictors.
      </div>

      {/* Whitelist Chart 4: Customer Gender Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                Whitelist Chart 4 (Ref: Step 6.Customer.1)
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Customer Gender Distribution
              </h3>
            </div>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>

          <GenderDistributionPieChart data={charts.gender_distribution} />

          <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Male
              </span>
              <span className="font-mono font-bold text-white">25,848 (51.7%)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> Female
              </span>
              <span className="font-mono font-bold text-white">23,146 (46.3%)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Other
              </span>
              <span className="font-mono font-bold text-white">1,006 (2.0%)</span>
            </div>
          </div>
        </div>

        {/* Card Portfolio & Device Tables */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Type Distribution Table */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" /> Card Type Distribution &amp; Fraud Prevalence
              </h3>
              <span className="text-[11px] text-slate-400">Ref: df['Card_Type'].value_counts()</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="py-2 px-3">Card Network</th>
                    <th className="py-2 px-3 text-right">Legitimate</th>
                    <th className="py-2 px-3 text-right">Fraud</th>
                    <th className="py-2 px-3 text-right">Total Volume</th>
                    <th className="py-2 px-3 text-right">Fraud Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {tables.card_type?.map((row) => (
                    <tr key={row.card_type} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-sans font-bold text-slate-200">{row.card_type}</td>
                      <td className="py-2 px-3 text-right text-slate-300">{row.legitimate.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-rose-400 font-bold">{row.fraud.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-slate-400">{row.total.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-bold text-amber-300">{row.fraud_rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card Category & Device Type Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" /> Card Tier Distribution
              </h4>
              <div className="space-y-1.5 text-xs font-mono">
                {tables.card_category?.map((c) => (
                  <div key={c.category} className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300 font-sans">{c.category}</span>
                    <span className="text-slate-200">{c.count.toLocaleString()} ({c.pct}%)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-amber-400" /> Device Type Breakdown
              </h4>
              <div className="space-y-1.5 text-xs font-mono">
                {tables.device_type?.map((d) => (
                  <div key={d.device_type} className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300 font-sans">{d.device_type}</span>
                    <span className="text-slate-200">{d.total.toLocaleString()} ({d.fraud_rate}% fraud)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
