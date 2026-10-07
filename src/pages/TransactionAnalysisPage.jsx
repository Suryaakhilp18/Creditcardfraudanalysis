import React from 'react';
import { DollarSign, BarChart3, TrendingUp, Calendar, CreditCard, Activity } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import AmountHistogramChart from '../charts/AmountHistogramChart';
import AmountByFraudBarChart from '../charts/AmountByFraudBarChart';
import VelocityAmountLineChart from '../charts/VelocityAmountLineChart';

export default function TransactionAnalysisPage({ summaryData }) {
  if (!summaryData) return null;

  const kpis = summaryData.kpis || {};
  const charts = summaryData.charts || {};
  const tables = summaryData.tables || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      <SectionHeader
        stepNumber="Step 6.Transaction"
        title="Transaction Amount &amp; Frequency Analysis"
        subtitle="Evaluation of transaction amount distributions, velocity impact (past 24 hours), payment methods, and weekend vs weekday fraud vulnerability."
        badge="Pure Reference HTML Logic"
      />

      {/* Transaction Amount Range Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs uppercase text-slate-400 font-semibold">Minimum Amount</span>
          <p className="text-2xl font-bold text-white font-mono">${kpis.min_transaction_amount}</p>
          <span className="text-[11px] text-slate-400">Micro-transaction floor</span>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs uppercase text-slate-400 font-semibold">Median Amount (50%)</span>
          <p className="text-2xl font-bold text-cyan-300 font-mono">${kpis.median_transaction_amount?.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Cardholder typical spend</span>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs uppercase text-slate-400 font-semibold">Average Amount</span>
          <p className="text-2xl font-bold text-emerald-400 font-mono">${kpis.avg_transaction_amount?.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Skewed by high outliers</span>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs uppercase text-slate-400 font-semibold">Maximum Amount</span>
          <p className="text-2xl font-bold text-rose-400 font-mono">${kpis.max_transaction_amount?.toLocaleString()}</p>
          <span className="text-[11px] text-rose-300">Extreme luxury ceiling</span>
        </div>
      </div>

      {/* Charts Row: Whitelist Chart 2 (Histogram) & Whitelist Chart 3 (Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Whitelist Chart 2: Amount Histogram */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                Whitelist Chart 2 (Ref: Step 6.5)
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Distribution of Transaction Amount
              </h3>
            </div>
            <span className="badge badge-legit">10 Equidistant Bins</span>
          </div>

          <AmountHistogramChart data={charts.amount_histogram} />

          <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
            <strong>Statistical Insight:</strong> The transaction amount shows a heavy right-skewed Pareto distribution. Over 92% of all transactions fall below $12,700, while the remaining long tail represents high-risk capital movements.
          </p>
        </div>

        {/* Whitelist Chart 3: Amount by Fraud Status */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                Whitelist Chart 3 (Ref: Step 6.6)
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Average Transaction Amount by Fraud Status
              </h3>
            </div>
            <span className="badge badge-fraud">+$672.08 Spread</span>
          </div>

          <AmountByFraudBarChart data={charts.amount_by_fraud} />

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40">
              <span className="text-slate-400">Legitimate Swipes:</span>
              <p className="text-lg font-bold text-emerald-300 font-mono mt-0.5">${kpis.legit_avg_amount?.toLocaleString()}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40">
              <span className="text-slate-400">Fraudulent Swipes:</span>
              <p className="text-lg font-bold text-rose-400 font-mono mt-0.5">${kpis.fraud_avg_amount?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Whitelist Chart 6: Average Amount by Velocity (Transactions_Last_24H head 15) */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
              Whitelist Chart 6 (Ref: Step 6.9)
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Average Transaction Amount by Recent Transaction Frequency
            </h3>
          </div>
          <span className="badge badge-legit">Transactions_Last_24H Head 15</span>
        </div>

        <VelocityAmountLineChart data={charts.velocity_amount} />

        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Velocity Attack Indicator:</strong> This curve replicates <code className="font-mono text-cyan-300">df.groupby("Transactions_Last_24H")["Transaction_Amount"].mean().head(15)</code>. Notice how the average transaction amount fluctuates as frequency escalates, highlighting cards experiencing sudden rapid-fire testing swipes before large fraud attempts.
        </p>
      </div>

      {/* Payment Method & Weekend Crosstabs from Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method Crosstab */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-cyan-400" /> Payment Method vs Fraud Status
            </h4>
            <span className="text-[11px] text-slate-400">Ref: pd.crosstab(df["Payment_Method"], ...)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-2 px-3">Payment Method</th>
                  <th className="py-2 px-3 text-right">Legit (0.0)</th>
                  <th className="py-2 px-3 text-right">Fraud (1.0)</th>
                  <th className="py-2 px-3 text-right">Fraud Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {tables.payment_method?.map((p) => (
                  <tr key={p.payment_method} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 font-sans font-medium text-slate-200">{p.payment_method}</td>
                    <td className="py-2 px-3 text-right text-slate-300">{p.legitimate.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-rose-400 font-bold">{p.fraud.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-bold text-amber-300">{p.fraud_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekend vs Fraud Crosstab */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" /> Weekend vs Fraud Status
            </h4>
            <span className="text-[11px] text-slate-400">Ref: pd.crosstab(df["Is_Weekend"], ...)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-2 px-3">Is Weekend?</th>
                  <th className="py-2 px-3 text-right">Legit (0.0)</th>
                  <th className="py-2 px-3 text-right">Fraud (1.0)</th>
                  <th className="py-2 px-3 text-right">Total Swipes</th>
                  <th className="py-2 px-3 text-right">Fraud Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {tables.weekend_analysis?.map((w) => (
                  <tr key={w.is_weekend} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 font-sans font-medium text-slate-200">
                      {w.is_weekend === 'Yes' ? 'Weekend (Sat-Sun)' : 'Weekday (Mon-Fri)'}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-300">{w.legitimate.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-rose-400 font-bold">{w.fraud.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-400">{w.total.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-bold text-amber-300">{w.fraud_rate}%</td>
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
