import React from 'react';

export default function ConfusionMatrixView({ cm, modelName }) {
  if (!cm) return null;

  const { tn, fp, fn, tp, total } = cm;
  const tnRate = total > 0 ? ((tn / total) * 100).toFixed(1) : 0;
  const fpRate = total > 0 ? ((fp / total) * 100).toFixed(1) : 0;
  const fnRate = total > 0 ? ((fn / total) * 100).toFixed(1) : 0;
  const tpRate = total > 0 ? ((tp / total) * 100).toFixed(1) : 0;

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900/90 rounded-xl p-5 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Confusion Matrix: <span className="text-cyan-400">{modelName}</span>
        </h4>
        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
          Test N = {total?.toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-12 gap-2 text-center text-xs">
        {/* Header Row */}
        <div className="col-span-4"></div>
        <div className="col-span-4 font-bold text-emerald-400 py-1 bg-emerald-950/30 rounded border border-emerald-900/40">
          Pred: LEGIT (0)
        </div>
        <div className="col-span-4 font-bold text-rose-400 py-1 bg-rose-950/30 rounded border border-rose-900/40">
          Pred: FRAUD (1)
        </div>

        {/* Row 1: Actual Legit */}
        <div className="col-span-4 flex items-center justify-center font-bold text-emerald-400 py-2 bg-emerald-950/30 rounded border border-emerald-900/40 text-left px-2">
          Actual: LEGIT (0)
        </div>
        <div className="col-span-4 p-3 rounded-lg bg-emerald-900/30 border border-emerald-600/40 hover:border-emerald-500 transition-all flex flex-col justify-center items-center">
          <span className="text-xs text-emerald-300 font-medium uppercase">True Neg (TN)</span>
          <span className="text-xl sm:text-2xl font-bold text-emerald-200 mt-1">{tn.toLocaleString()}</span>
          <span className="text-[11px] text-emerald-400/80">{tnRate}% of test</span>
        </div>
        <div className="col-span-4 p-3 rounded-lg bg-amber-900/20 border border-amber-600/30 hover:border-amber-500 transition-all flex flex-col justify-center items-center">
          <span className="text-xs text-amber-300 font-medium uppercase">False Pos (FP)</span>
          <span className="text-xl sm:text-2xl font-bold text-amber-200 mt-1">{fp.toLocaleString()}</span>
          <span className="text-[11px] text-amber-400/80">{fpRate}% of test</span>
        </div>

        {/* Row 2: Actual Fraud */}
        <div className="col-span-4 flex items-center justify-center font-bold text-rose-400 py-2 bg-rose-950/30 rounded border border-rose-900/40 text-left px-2">
          Actual: FRAUD (1)
        </div>
        <div className="col-span-4 p-3 rounded-lg bg-rose-900/20 border border-rose-600/30 hover:border-rose-500 transition-all flex flex-col justify-center items-center">
          <span className="text-xs text-rose-300 font-medium uppercase">False Neg (FN)</span>
          <span className="text-xl sm:text-2xl font-bold text-rose-200 mt-1">{fn.toLocaleString()}</span>
          <span className="text-[11px] text-rose-400/80">{fnRate}% of test</span>
        </div>
        <div className="col-span-4 p-3 rounded-lg bg-emerald-900/40 border border-emerald-500/60 hover:border-emerald-400 transition-all flex flex-col justify-center items-center">
          <span className="text-xs text-emerald-300 font-medium uppercase">True Pos (TP)</span>
          <span className="text-xl sm:text-2xl font-bold text-emerald-100 mt-1">{tp.toLocaleString()}</span>
          <span className="text-[11px] text-emerald-400/80">{tpRate}% of test</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-300">
        <div className="bg-slate-800/40 p-2 rounded">
          <span className="text-slate-400">Specificity (TN Rate):</span>{' '}
          <strong className="text-slate-100">{((tn / (tn + fp)) * 100).toFixed(2)}%</strong>
        </div>
        <div className="bg-slate-800/40 p-2 rounded">
          <span className="text-slate-400">Sensitivity / Recall:</span>{' '}
          <strong className="text-slate-100">{((tp / (tp + fn)) * 100).toFixed(2)}%</strong>
        </div>
      </div>
    </div>
  );
}
