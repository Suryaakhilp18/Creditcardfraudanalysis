import React from 'react';
import { Menu, Presentation, Database, ShieldAlert, Sparkles } from 'lucide-react';

export default function Header({ onToggleSidebar, onOpenPresentation, activeSectionName, kpis }) {
  return (
    <header className="sticky top-0 z-30 w-full bg-navy-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                CREDIT CARD FRAUD ANALYSIS &amp; DETECTION
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Real CSV Data Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Data Analytics &amp; Machine Learning Project • <span className="text-cyan-400">{activeSectionName}</span>
            </p>
          </div>
        </div>

        {/* Right: Quick Indicators & Presentation Button */}
        <div className="flex items-center gap-3">
          {kpis && (
            <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span><strong>{kpis.total_transactions?.toLocaleString()}</strong> Txns</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1.5 text-rose-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span><strong>{kpis.fraud_rate_pct}%</strong> Fraud</span>
              </div>
            </div>
          )}

          <button
            onClick={onOpenPresentation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-navy-950 transition-colors shadow-md shadow-cyan-500/20"
          >
            <Presentation className="w-4 h-4" />
            <span className="hidden sm:inline">Presentation Mode</span>
          </button>
        </div>
      </div>
    </header>
  );
}
