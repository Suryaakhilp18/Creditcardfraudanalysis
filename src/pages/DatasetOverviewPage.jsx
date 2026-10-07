import React, { useState, useEffect } from 'react';
import { Database, Search, ArrowUpDown, ChevronLeft, ChevronRight, Filter, Eye, AlertCircle } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { fetchTransactions } from '../data/dataService';
import TransactionModal from '../components/TransactionModal';

export default function DatasetOverviewPage({ summaryData }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);

  const dataset = summaryData?.dataset_info || {};
  const kpis = summaryData?.kpis || {};
  const exploration = summaryData?.exploration || {};

  useEffect(() => {
    loadTableData();
  }, [page, search]);

  const loadTableData = async () => {
    setLoading(true);
    try {
      const res = await fetchTransactions({ page, limit: 12, search });
      setTransactions(res.items || []);
      setTotalPages(res.total_pages || 1);
      setTotalCount(res.total || 0);
    } catch (err) {
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <SectionHeader
        stepNumber="Step 1 &amp; 2"
        title="Dataset Overview &amp; Specifications"
        subtitle="Data loading, schema structure, data types, missing value audit, and interactive tabular record explorer."
        badge="Real CSV Data Source"
      />

      {/* Dataset Metadata Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="p-4 rounded-xl glass-panel border border-slate-800">
          <span className="text-slate-400 uppercase font-semibold">Dataset Name</span>
          <p className="text-sm font-bold text-white mt-1 truncate" title="Credit Card Fraud Dataset">
            Credit Card Fraud
          </p>
          <span className="text-[10px] text-cyan-400">6+ Years Coverage</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800">
          <span className="text-slate-400 uppercase font-semibold">Raw CSV Dimensions</span>
          <p className="text-base font-bold text-white mt-1">
            60,000 × 69
          </p>
          <span className="text-[10px] text-slate-400">Rows × Columns</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800">
          <span className="text-slate-400 uppercase font-semibold">Cleaned Dataset</span>
          <p className="text-base font-bold text-emerald-400 mt-1">
            50,000 × 48
          </p>
          <span className="text-[10px] text-emerald-300">Valid Ground Truth</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800">
          <span className="text-slate-400 uppercase font-semibold">Target Column</span>
          <p className="text-base font-bold text-rose-400 mt-1 font-mono">
            Is_Fraud
          </p>
          <span className="text-[10px] text-slate-400">Binary {0, 1}</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800">
          <span className="text-slate-400 uppercase font-semibold">Duplicates Count</span>
          <p className="text-base font-bold text-cyan-300 mt-1">
            0
          </p>
          <span className="text-[10px] text-slate-400">Unique Txn IDs</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800">
          <span className="text-slate-400 uppercase font-semibold">Legacy Rows Removed</span>
          <p className="text-base font-bold text-amber-400 mt-1">
            10,000
          </p>
          <span className="text-[10px] text-amber-300">Null Target Labels</span>
        </div>
      </div>

      {/* Schema Attributes Breakdown Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Original CSV Schema Properties (Top Attributes)
          </h3>
          <span className="text-xs text-slate-400">Total Attributes: {exploration.raw_columns_list?.length || 69}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Column Name</th>
                <th className="py-2.5 px-3">Data Type</th>
                <th className="py-2.5 px-3">Raw Missing Count</th>
                <th className="py-2.5 px-3">Missing Pct</th>
                <th className="py-2.5 px-3">Handling in Project</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {exploration.raw_columns_list?.slice(0, 15).map((col) => {
                const missing = exploration.raw_missing?.[col] || 0;
                const dtype = exploration.raw_dtypes?.[col] || 'object';
                const isLegacy = dataset.legacy_columns_dropped?.includes(col);
                const isId = dataset.id_columns_dropped?.includes(col);
                const isLeakage = dataset.leakage_columns_dropped?.includes(col);

                let handling = "Standardized & Kept";
                let badgeClass = "bg-emerald-500/10 text-emerald-400";
                if (isLegacy) {
                  handling = "Dropped (Deprecated Legacy Field)";
                  badgeClass = "bg-rose-500/10 text-rose-400";
                } else if (isId) {
                  handling = "Dropped (Identifier to prevent overfitting)";
                  badgeClass = "bg-amber-500/10 text-amber-400";
                } else if (isLeakage) {
                  handling = "Dropped (Post-Transaction Leakage)";
                  badgeClass = "bg-purple-500/10 text-purple-400";
                }

                return (
                  <tr key={col} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-slate-200 font-semibold">{col}</td>
                    <td className="py-2 px-3 text-cyan-300">{dtype}</td>
                    <td className="py-2 px-3 text-slate-300">{missing.toLocaleString()}</td>
                    <td className="py-2 px-3 text-slate-400">{((missing / 60000) * 100).toFixed(1)}%</td>
                    <td className="py-2 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${badgeClass}`}>
                        {handling}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Paginated Dataset Viewer */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Interactive Transaction Viewer</h3>
            <p className="text-xs text-slate-400">
              Browse actual cleaned records from the dataset with search and pagination (Displaying {transactions.length} of {totalCount} matching records)
            </p>
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, merchant, city..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Card</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Merchant Category</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 font-sans">
                    Loading verified dataset records...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 font-sans">
                    No matching transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-3 font-semibold text-slate-200">{t.id}</td>
                    <td className="py-2 px-3 text-slate-400">{t.customer_id}</td>
                    <td className="py-2 px-3 text-slate-300">{t.card_type}</td>
                    <td className="py-2 px-3 font-bold text-cyan-300">${t.transaction_amount.toLocaleString()}</td>
                    <td className="py-2 px-3 font-sans text-slate-300">{t.merchant_category}</td>
                    <td className="py-2 px-3 font-sans text-slate-400">{t.transaction_channel}</td>
                    <td className="py-2 px-3">
                      <span className={`badge ${t.is_fraud === 1 ? 'badge-fraud' : 'badge-legit'}`}>
                        {t.is_fraud === 1 ? 'Fraud' : 'Legit'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-sans">
                      <button
                        onClick={() => setSelectedTxn(t)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
          <span>Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors flex items-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {selectedTxn && (
        <TransactionModal
          transaction={selectedTxn}
          onClose={() => setSelectedTxn(null)}
        />
      )}
    </div>
  );
}
