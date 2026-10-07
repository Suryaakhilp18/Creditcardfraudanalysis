import React, { useState } from 'react';
import { Search, Hash, FileText, CheckCircle, HelpCircle } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

export default function DataExplorationPage({ summaryData }) {
  const [activeTab, setActiveTab] = useState('numeric'); // 'numeric', 'categorical', 'uniques'

  if (!summaryData) return null;

  const exploration = summaryData.exploration || {};
  const numDescribe = exploration.numeric_describe || {};
  const objDescribe = exploration.object_describe || {};

  const uniqueSamples = [
    { column: "Card_Type", uniques: ["Visa", "Mastercard", "RuPay", "American Express"] },
    { column: "Card_Category", uniques: ["Classic", "Platinum", "Gold", "Signature"] },
    { column: "Customer_Gender", uniques: ["Male", "Female", "Other"] },
    { column: "Currency", uniques: ["INR", "EUR", "AED", "USD", "GBP"] },
    { column: "Transaction_Channel", uniques: ["Online", "ATM", "POS", "Contactless", "Mobile App"] },
    { column: "Payment_Method", uniques: ["Mobile Wallet", "Contactless", "Chip", "Online Card", "Swipe"] },
    { column: "Device_Type", uniques: ["Desktop", "Mobile", "POS Terminal", "Tablet"] },
    { column: "Operating_System", uniques: ["iOS", "macOS", "Windows", "Android", "Linux"] },
    { column: "Browser", uniques: ["Chrome", "Edge", "Firefox", "Safari", "Other"] },
    { column: "Merchant_Category", uniques: ["Grocery", "ATM", "Online Shopping", "Travel", "Utilities", "Other", "Entertainment", "Fuel", "Electronics", "Healthcare", "Jewelry", "Dining"] },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <SectionHeader
        stepNumber="Step 3"
        title="Exploratory Data Analysis (EDA) &amp; Statistical Profiling"
        subtitle="Full parametric distribution audit, statistical summary (df.describe()), categorical frequencies, and unique domain values directly matching the reference notebook."
        badge="Pure Academic Statistics"
      />

      {/* Exploration Tab Switcher */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('numeric')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === 'numeric'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Numerical Summary (df.describe())
        </button>
        <button
          onClick={() => setActiveTab('categorical')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === 'categorical'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Categorical Summary (include='object')
        </button>
        <button
          onClick={() => setActiveTab('uniques')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === 'uniques'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Domain Unique Categories
        </button>
      </div>

      {/* Tab 1: Numeric Describe */}
      {activeTab === 'numeric' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Hash className="w-4 h-4 text-cyan-400" />
              Parametric Summary of Numerical Variables (df.describe())
            </h3>
            <span className="text-xs text-slate-400 font-mono">N = 50,000 Valid Records</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Column Name</th>
                  <th className="py-2.5 px-3 text-right">Count</th>
                  <th className="py-2.5 px-3 text-right">Mean</th>
                  <th className="py-2.5 px-3 text-right">Std Dev</th>
                  <th className="py-2.5 px-3 text-right">Min</th>
                  <th className="py-2.5 px-3 text-right">25%</th>
                  <th className="py-2.5 px-3 text-right">50% (Median)</th>
                  <th className="py-2.5 px-3 text-right">75%</th>
                  <th className="py-2.5 px-3 text-right">Max</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {Object.entries(numDescribe).map(([col, stats]) => (
                  <tr key={col} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 font-semibold text-slate-200">{col}</td>
                    <td className="py-2 px-3 text-right text-slate-400">{stats.count?.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-cyan-300 font-medium">{stats.mean?.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-400">{stats.std?.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-300">{stats.min?.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-400">{stats['25%']?.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-200 font-semibold">{stats['50%']?.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-400">{stats['75%']?.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-rose-300 font-bold">{stats.max?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Categorical Describe */}
      {activeTab === 'categorical' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Categorical Feature Summary (df.describe(include='object'))
            </h3>
            <span className="text-xs text-slate-400 font-mono">N = 50,000 Records</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Feature Name</th>
                  <th className="py-2.5 px-3 text-right">Non-Null Count</th>
                  <th className="py-2.5 px-3 text-right">Unique Classes</th>
                  <th className="py-2.5 px-3">Top Category (Mode)</th>
                  <th className="py-2.5 px-3 text-right">Top Freq</th>
                  <th className="py-2.5 px-3 text-right">Mode Prevalence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {Object.entries(objDescribe).map(([col, stats]) => (
                  <tr key={col} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 font-semibold text-slate-200">{col}</td>
                    <td className="py-2 px-3 text-right text-slate-400">{stats.count?.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-cyan-300 font-bold">{stats.unique}</td>
                    <td className="py-2 px-3 font-sans text-emerald-300 font-medium">{stats.top}</td>
                    <td className="py-2 px-3 text-right text-slate-300">{stats.freq?.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-400 font-sans">
                      {((stats.freq / (stats.count || 50000)) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Unique Values */}
      {activeTab === 'uniques' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              Verified Unique Values Inspected in Reference Notebook
            </h3>
            <span className="text-xs text-slate-400 font-mono">Reference Cells [21 - 84]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uniqueSamples.map((u) => (
              <div key={u.column} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-cyan-400 font-bold text-xs">{u.column}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{u.uniques.length} categories</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {u.uniques.map((val) => (
                    <span
                      key={val}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700 font-medium"
                    >
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
