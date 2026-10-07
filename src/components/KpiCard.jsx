import React from 'react';

export default function KpiCard({ title, value, subtitle, icon: Icon, color = 'cyan', badge, trend }) {
  const colorMap = {
    cyan: {
      border: 'hover:border-cyan-500/40',
      glow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      textAccent: 'text-cyan-400'
    },
    emerald: {
      border: 'hover:border-emerald-500/40',
      glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      textAccent: 'text-emerald-400'
    },
    rose: {
      border: 'hover:border-rose-500/40',
      glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      textAccent: 'text-rose-400'
    },
    amber: {
      border: 'hover:border-amber-500/40',
      glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      textAccent: 'text-amber-400'
    },
    indigo: {
      border: 'hover:border-indigo-500/40',
      glow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      textAccent: 'text-indigo-400'
    }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div className={`group relative glass-panel rounded-xl p-5 transition-all duration-300 ${scheme.border} ${scheme.glow}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg border ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || badge || trend) && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-400 font-medium">{subtitle}</span>}
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {badge}
            </span>
          )}
          {trend && (
            <span className={`font-semibold ${trend.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
