import React from 'react';

export default function SectionHeader({ stepNumber, title, subtitle, badge }) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b border-slate-800">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          {stepNumber && (
            <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {stepNumber}
            </span>
          )}
          {badge && (
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {badge}
            </span>
          )}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-slate-400 mt-1 max-w-3xl">{subtitle}</p>}
      </div>
    </div>
  );
}
