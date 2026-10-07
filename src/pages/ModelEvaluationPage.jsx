import React, { useState } from 'react';
import { CheckCircle2, Award, AlertCircle, BarChart3, HelpCircle } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ConfusionMatrixView from '../charts/ConfusionMatrixView';

export default function ModelEvaluationPage({ summaryData }) {
  const [selectedModel, setSelectedModel] = useState('Random Forest');

  if (!summaryData) return null;

  const modelMeta = summaryData.model_evaluation || {};
  const models = modelMeta.models || {};
  const splitInfo = modelMeta.split_summary || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      <SectionHeader
        stepNumber="Step 10"
        title="Model Evaluation, Benchmarking &amp; Confusion Matrices"
        subtitle="Objective empirical evaluation on 10,000 unseen test records across Accuracy, Precision, Recall, F1-Score, and Confusion Matrices."
        badge="Zero Fabricated Scores"
      />

      {/* Main Model Comparison Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Comparative Test Performance Metrics (10,000 Holdout Samples)
            </h3>
            <p className="text-xs text-slate-400">Class imbalance weighted (class_weight='balanced') across all evaluated estimators.</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-semibold bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/40">
            Holdout Test Split: 20%
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Model Algorithm</th>
                <th className="py-3 px-4 text-center">Training Time</th>
                <th className="py-3 px-4 text-center">Accuracy</th>
                <th className="py-3 px-4 text-center">Precision</th>
                <th className="py-3 px-4 text-center">Recall (Sensitivity)</th>
                <th className="py-3 px-4 text-center">F1-Score</th>
                <th className="py-3 px-4 text-center">ROC AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {Object.entries(models).map(([name, m]) => {
                const isSelected = selectedModel === name;
                return (
                  <tr
                    key={name}
                    onClick={() => setSelectedModel(name)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-cyan-500/10' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-4 font-sans font-bold text-slate-100 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
                      {name}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-400">{m.train_time_sec}s</td>
                    <td className="py-3 px-4 text-center font-bold text-cyan-300">{m.accuracy_pct}%</td>
                    <td className="py-3 px-4 text-center text-slate-200">{m.precision}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400">{m.recall_pct}%</td>
                    <td className="py-3 px-4 text-center font-bold text-amber-300">{m.f1_score}</td>
                    <td className="py-3 px-4 text-center text-slate-300">{m.roc_auc}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Confusion Matrix Selector & View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Selector Tabs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Select Model for Confusion Matrix Inspection
            </h4>

            <div className="space-y-2.5">
              {Object.entries(models).map(([name, m]) => (
                <button
                  key={name}
                  onClick={() => setSelectedModel(name)}
                  className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                    selectedModel === name
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h5 className="font-bold text-sm text-slate-100">{name}</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Acc: {m.accuracy_pct}% • Recall: {m.recall_pct}% • F1: {m.f1_score}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    selectedModel === name ? 'bg-cyan-500 text-navy-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    Inspect Matrix
                  </span>
                </button>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 space-y-1.5">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" /> How to Read the Metrics:
              </span>
              <p>
                <strong>Recall (Sensitivity):</strong> Ability to capture all actual fraud. A model with low recall lets fraudsters get away unnoticed.
              </p>
              <p>
                <strong>Precision:</strong> Percentage of flagged transactions that were actually fraudulent. Low precision causes customer inconvenience via false alarms.
              </p>
            </div>
          </div>
        </div>

        {/* Matrix Visualization Column */}
        <div className="lg:col-span-7">
          {models[selectedModel] && (
            <ConfusionMatrixView
              cm={models[selectedModel].confusion_matrix}
              modelName={selectedModel}
            />
          )}
        </div>
      </div>
    </div>
  );
}
