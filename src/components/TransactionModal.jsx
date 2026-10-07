import React from 'react';
import { X, ShieldAlert, ShieldCheck, CreditCard, User, Clock, MapPin, Smartphone, AlertTriangle } from 'lucide-react';

export default function TransactionModal({ transaction, onClose }) {
  if (!transaction) return null;

  const isFraud = transaction.is_fraud === 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className={`p-5 flex items-center justify-between border-b ${
          isFraud ? 'bg-rose-950/40 border-rose-900/60' : 'bg-emerald-950/40 border-emerald-900/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isFraud ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {isFraud ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-white">{transaction.id}</span>
                <span className={`badge ${isFraud ? 'badge-fraud' : 'badge-legit'}`}>
                  {isFraud ? 'FRAUDULENT TRANSACTION' : 'LEGITIMATE TRANSACTION'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Timestamp: {transaction.month_name} {transaction.year} • Hour {transaction.transaction_hour}:00 • {transaction.day_of_week}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Financial Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Transaction Amount</span>
              <p className="text-xl font-bold text-cyan-300 mt-0.5">${transaction.transaction_amount.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Credit Limit</span>
              <p className="text-lg font-semibold text-slate-200 mt-0.5">${transaction.credit_limit.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Customer Income</span>
              <p className="text-lg font-semibold text-slate-200 mt-0.5">${transaction.customer_income.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Credit Score</span>
              <p className="text-lg font-semibold text-slate-200 mt-0.5">{transaction.credit_score}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Card & Payment Info */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/40">
              <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 text-sm">
                <CreditCard className="w-4 h-4 text-cyan-400" /> Card &amp; Payment Details
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Card Type / Category</span>
                  <span className="font-medium text-slate-200">{transaction.card_type} ({transaction.card_category})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Channel</span>
                  <span className="font-medium text-slate-200">{transaction.transaction_channel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Payment Method</span>
                  <span className="font-medium text-slate-200">{transaction.payment_method}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Merchant Category</span>
                  <span className="font-medium text-slate-200">{transaction.merchant_category}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Merchant Location</span>
                  <span className="font-medium text-slate-200">{transaction.merchant_city}, {transaction.merchant_country}</span>
                </div>
              </div>
            </div>

            {/* Risk & Security Telemetry */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/40">
              <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 text-sm">
                <Smartphone className="w-4 h-4 text-amber-400" /> Device &amp; Risk Metrics
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">IP Risk Score</span>
                  <span className={`font-semibold ${transaction.ip_risk_score >= 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {transaction.ip_risk_score} / 100
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Transactions (Past 24h)</span>
                  <span className={`font-semibold ${transaction.transactions_last_24h >= 8 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {transaction.transactions_last_24h}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Distance From Last Txn</span>
                  <span className="font-medium text-slate-200">{transaction.distance_km} km</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Device Type</span>
                  <span className="font-medium text-slate-200">{transaction.device_type}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Security Alert Triggered</span>
                  <span className={`font-semibold ${transaction.alert_generated === 'Yes' ? 'text-amber-400' : 'text-slate-400'}`}>
                    {transaction.alert_generated}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Annotation */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-xs text-slate-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Academic Audit Note:</strong> This record was drawn from the verified 50,000-transaction dataset. 
              The label <code className="text-cyan-300 font-mono">Is_Fraud = {transaction.is_fraud}</code> was ground-truthed during preprocessing.
              {isFraud && " Fraud indicator matches high-risk vector signatures identified during exploratory analysis."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Detail View
          </button>
        </div>
      </div>
    </div>
  );
}
