import React, { useState } from 'react';
import { Cpu, Play, ShieldAlert, ShieldCheck, Zap, RefreshCw, AlertCircle, Sliders, CheckCircle2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { predictTransaction } from '../data/dataService';

export default function MachineLearningPage({ summaryData }) {
  const [modelChoice, setModelChoice] = useState('Random Forest');
  const [formData, setFormData] = useState({
    transaction_amount: 2500,
    credit_limit: 100000,
    customer_income: 75000,
    ip_risk_score: 25,
    transactions_last_24h: 3,
    transaction_hour: 14,
    failed_authentication_count: 0,
    transaction_channel: 'Online',
    payment_method: 'Online Card',
    card_type: 'Visa',
    device_type: 'Mobile',
    vpn_used: 'No',
    card_present: 'No',
    avg_transaction_amount_30d: 2000
  });

  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const modelMeta = summaryData?.model_evaluation || {};
  const splitInfo = modelMeta.split_summary || {};
  const rfImportances = modelMeta.random_forest_importances || [];
  const lrCoefs = modelMeta.logistic_regression_coefficients || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const applyPreset = (type) => {
    if (type === 'legit') {
      setFormData({
        transaction_amount: 45.5,
        credit_limit: 150000,
        customer_income: 90000,
        ip_risk_score: 12,
        transactions_last_24h: 1,
        transaction_hour: 15,
        failed_authentication_count: 0,
        transaction_channel: 'POS',
        payment_method: 'Chip',
        card_type: 'Visa',
        device_type: 'POS Terminal',
        vpn_used: 'No',
        card_present: 'Yes',
        avg_transaction_amount_30d: 55
      });
    } else if (type === 'high_risk') {
      setFormData({
        transaction_amount: 14850,
        credit_limit: 20000,
        customer_income: 45000,
        ip_risk_score: 92,
        transactions_last_24h: 14,
        transaction_hour: 3,
        failed_authentication_count: 3,
        transaction_channel: 'Online',
        payment_method: 'Online Card',
        card_type: 'Mastercard',
        device_type: 'Desktop',
        vpn_used: 'Yes',
        card_present: 'No',
        avg_transaction_amount_30d: 850
      });
    } else if (type === 'velocity') {
      setFormData({
        transaction_amount: 4200,
        credit_limit: 50000,
        customer_income: 60000,
        ip_risk_score: 78,
        transactions_last_24h: 9,
        transaction_hour: 2,
        failed_authentication_count: 1,
        transaction_channel: 'Contactless',
        payment_method: 'Contactless',
        card_type: 'RuPay',
        device_type: 'Mobile',
        vpn_used: 'No',
        card_present: 'Yes',
        avg_transaction_amount_30d: 600
      });
    }
  };

  const handleRunInference = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        model_choice: modelChoice
      };
      const result = await predictTransaction(payload);
      setPredictionResult(result);
    } catch (err) {
      console.error("Inference error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <SectionHeader
        stepNumber="Step 9 &amp; 11"
        title="Machine Learning &amp; Real-time Inference Engine"
        subtitle="Training and live scoring using the serialized credit_card_fraud_model.pkl pipeline trained on 40,000 records with class_weight='balanced'."
        badge="Live Serialized Model"
      />

      {/* Architecture & Split Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl glass-panel border border-slate-800">
          <span className="text-slate-400 uppercase font-semibold">Training Records</span>
          <p className="text-xl font-bold text-white mt-1">{splitInfo.train_samples?.toLocaleString()} (80%)</p>
          <span className="text-[10px] text-cyan-400">Stratified Balanced Split</span>
        </div>
        <div className="p-4 rounded-xl glass-panel border border-slate-800">
          <span className="text-slate-400 uppercase font-semibold">Test Validation</span>
          <p className="text-xl font-bold text-white mt-1">{splitInfo.test_samples?.toLocaleString()} (20%)</p>
          <span className="text-[10px] text-emerald-400">Unseen Evaluation Set</span>
        </div>
        <div className="p-4 rounded-xl glass-panel border border-slate-800">
          <span className="text-slate-400 uppercase font-semibold">Imbalance Strategy</span>
          <p className="text-lg font-bold text-amber-300 mt-1 font-mono">class_weight='balanced'</p>
          <span className="text-[10px] text-slate-400">Inverse class penalty</span>
        </div>
        <div className="p-4 rounded-xl glass-panel border border-slate-800">
          <span className="text-slate-400 uppercase font-semibold">Model Artifact</span>
          <p className="text-sm font-bold text-cyan-300 mt-1 font-mono truncate" title="credit_card_fraud_model.pkl">
            credit_card_fraud_model.pkl
          </p>
          <span className="text-[10px] text-slate-400">Pickle Serialized</span>
        </div>
      </div>

      {/* Live Interactive Predictor / Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Live Fraud Detection Simulator
              </h3>
              <p className="text-xs text-slate-400">Enter transaction attributes or choose an academic test preset.</p>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('legit')}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
              >
                Normal Spend
              </button>
              <button
                type="button"
                onClick={() => applyPreset('velocity')}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
              >
                Velocity Surge
              </button>
              <button
                type="button"
                onClick={() => applyPreset('high_risk')}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
              >
                Critical Fraud
              </button>
            </div>
          </div>

          <form onSubmit={handleRunInference} className="space-y-4 text-xs">
            {/* Model Selection */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Select Inference Classifier</label>
              <div className="grid grid-cols-3 gap-2">
                {['Random Forest', 'Decision Tree', 'Logistic Regression'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModelChoice(m)}
                    className={`py-2 px-3 rounded-xl font-semibold border transition-all text-center ${
                      modelChoice === m
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Transaction Amount ($)</label>
                <input
                  type="number"
                  name="transaction_amount"
                  value={formData.transaction_amount}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Credit Limit ($)</label>
                <input
                  type="number"
                  name="credit_limit"
                  value={formData.credit_limit}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">30-Day Avg. Spend ($)</label>
                <input
                  type="number"
                  name="avg_transaction_amount_30d"
                  value={formData.avg_transaction_amount_30d}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">IP Risk Score (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="ip_risk_score"
                  value={formData.ip_risk_score}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Transactions (Past 24h)</label>
                <input
                  type="number"
                  min="0"
                  name="transactions_last_24h"
                  value={formData.transactions_last_24h}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Transaction Hour (0 - 23)</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  name="transaction_hour"
                  value={formData.transaction_hour}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Transaction Channel</label>
                <select
                  name="transaction_channel"
                  value={formData.transaction_channel}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Online">Online</option>
                  <option value="POS">POS Terminal</option>
                  <option value="Contactless">Contactless</option>
                  <option value="ATM">ATM</option>
                  <option value="Mobile App">Mobile App</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Card Present?</label>
                <select
                  name="card_present"
                  value={formData.card_present}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Yes">Yes (Physical Swipe/Chip)</option>
                  <option value="No">No (Card-Not-Present)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">VPN / Proxy Used?</label>
                <select
                  name="vpn_used"
                  value={formData.vpn_used}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-navy-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running Preprocessing &amp; Model Prediction...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-navy-950" />
                  Execute Real-Time Model Inference
                </>
              )}
            </button>
          </form>
        </div>

        {/* Inference Output Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Model Decision &amp; Probability
                </h4>
                <span className="text-[10px] text-cyan-400 font-mono">Trained Pipeline</span>
              </div>

              {predictionResult ? (
                <div className="mt-5 space-y-5 animate-fadeIn">
                  {/* Result Header Badge */}
                  <div className={`p-4 rounded-xl text-center border ${
                    predictionResult.is_fraud === 1
                      ? 'bg-rose-950/30 border-rose-600/50 text-rose-300'
                      : 'bg-emerald-950/30 border-emerald-600/50 text-emerald-300'
                  }`}>
                    <div className="inline-flex p-3 rounded-full bg-slate-900/80 mb-2">
                      {predictionResult.is_fraud === 1 ? (
                        <ShieldAlert className="w-8 h-8 text-rose-400" />
                      ) : (
                        <ShieldCheck className="w-8 h-8 text-emerald-400" />
                      )}
                    </div>
                    <h3 className="text-xl font-black tracking-wide">
                      CLASSIFIED AS: {predictionResult.prediction_label.toUpperCase()}
                    </h3>
                    <p className="text-xs mt-1 text-slate-300">
                      Model: {predictionResult.model_used} • Risk Tier: <strong className="font-bold">{predictionResult.risk_level}</strong>
                    </p>
                  </div>

                  {/* Probability Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Fraud Probability Score</span>
                      <span className={`font-mono ${predictionResult.is_fraud === 1 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {predictionResult.fraud_probability}%
                      </span>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ${
                          predictionResult.fraud_probability >= 70
                            ? 'bg-rose-500'
                            : predictionResult.fraud_probability >= 40
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${predictionResult.fraud_probability}%` }}
                      />
                    </div>
                  </div>

                  {/* Explainability Risk Factors */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Contributing Risk Factors:
                    </span>
                    <ul className="space-y-1.5 text-xs">
                      {predictionResult.risk_factors.map((f, i) => (
                        <li key={i} className="p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center space-y-3 text-slate-400">
                  <Cpu className="w-12 h-12 mx-auto text-slate-600" />
                  <p className="text-xs max-w-xs mx-auto">
                    Fill the form on the left or select a preset and click <strong>"Execute Real-Time Model Inference"</strong> to score a transaction.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Random Forest Gini Feature Importances (Top 12 Features)
          </h3>
          <span className="text-xs text-slate-400">Evaluated on Trained Model</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rfImportances.slice(0, 12).map((item, idx) => (
            <div key={item.feature} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-300 font-semibold truncate" title={item.feature}>
                  {idx + 1}. {item.feature}
                </span>
                <span className="font-mono text-slate-400 font-bold">{item.percentage}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full"
                  style={{ width: `${Math.min(item.percentage * 5, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
