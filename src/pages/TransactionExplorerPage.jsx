import React, { useState, useEffect } from 'react';
import { TableProperties, Search, Filter, RefreshCw, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { fetchTransactions } from '../data/dataService';
import TransactionModal from '../components/TransactionModal';

export default function TransactionExplorerPage({ summaryData }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [fraudFilter, setFraudFilter] = useState('all');
  const [cardType, setCardType] = useState('all');
  const [channel, setChannel] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [deviceType, setDeviceType] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, [page, limit, fraudFilter, cardType, channel, paymentMethod, deviceType, search]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetchTransactions({
        page,
        limit,
        fraud_filter: fraudFilter,
        card_type: cardType,
        channel,
        payment_method: paymentMethod,
        device_type: deviceType,
        search
      });
      setTransactions(res.items || []);
      setTotal(res.total || 0);
      setTotalPages(res.total_pages || 1);
    } catch (err) {
      console.error("Failed to load explorer transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setFraudFilter('all');
    setCardType('all');
    setChannel('all');
    setPaymentMethod('all');
    setDeviceType('all');
    setPage(1);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <SectionHeader
        stepNumber="Step 11"
        title="Transaction Explorer &amp; Filterable Data Catalog"
        subtitle="Searchable multi-dimensional audit explorer populated directly from real dataset transactions."
        badge="Live Interactive Filtering"
      />

      {/* Filter Toolbar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Transaction Multi-Filter Bar
            </h3>
          </div>

          <button
            onClick={resetFilters}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Reset All Filters
          </button>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <label className="block text-slate-400 font-medium mb-1">Search Keywords</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="ID, customer, city, amount..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Fraud Status Filter */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Fraud Classification</label>
            <select
              value={fraudFilter}
              onChange={(e) => {
                setFraudFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Transactions</option>
              <option value="fraud">Fraud Only (1.0)</option>
              <option value="legitimate">Legitimate Only (0.0)</option>
            </select>
          </div>

          {/* Card Type Filter */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Card Network</label>
            <select
              value={cardType}
              onChange={(e) => {
                setCardType(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Card Networks</option>
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
              <option value="RuPay">RuPay</option>
              <option value="American Express">American Express</option>
            </select>
          </div>

          {/* Channel Filter */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Channel</label>
            <select
              value={channel}
              onChange={(e) => {
                setChannel(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Channels</option>
              <option value="Online">Online</option>
              <option value="POS">POS Terminal</option>
              <option value="Contactless">Contactless</option>
              <option value="ATM">ATM</option>
              <option value="Mobile App">Mobile App</option>
            </select>
          </div>

          {/* Device Type Filter */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Device Type</label>
            <select
              value={deviceType}
              onChange={(e) => {
                setDeviceType(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Devices</option>
              <option value="Mobile">Mobile</option>
              <option value="Desktop">Desktop</option>
              <option value="POS Terminal">POS Terminal</option>
              <option value="Tablet">Tablet</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Found <strong>{total.toLocaleString()}</strong> matching records</span>
          <div className="flex items-center gap-2">
            <span>Show:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-700 rounded p-1 text-slate-200"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Customer ID</th>
                <th className="py-2.5 px-3">Card Info</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Merchant Category</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">IP Risk</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {loading ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400 font-sans">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
                    Querying real dataset records...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400 font-sans">
                    No transactions match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-3 font-semibold text-slate-200">{t.id}</td>
                    <td className="py-2 px-3 text-slate-400">{t.customer_id}</td>
                    <td className="py-2 px-3 text-slate-300 font-sans">{t.card_type} ({t.card_category})</td>
                    <td className="py-2 px-3 font-bold text-cyan-300">${t.transaction_amount.toLocaleString()}</td>
                    <td className="py-2 px-3 font-sans text-slate-300">{t.merchant_category}</td>
                    <td className="py-2 px-3 font-sans text-slate-400">{t.merchant_city}</td>
                    <td className="py-2 px-3 font-sans text-slate-400">{t.transaction_channel}</td>
                    <td className={`py-2 px-3 font-bold ${t.ip_risk_score >= 70 ? 'text-rose-400' : 'text-slate-400'}`}>
                      {t.ip_risk_score}
                    </td>
                    <td className="py-2 px-3 font-sans">
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

        {/* Pagination bar */}
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
