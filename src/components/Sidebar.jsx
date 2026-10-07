import React from 'react';
import {
  LayoutDashboard,
  Database,
  Search,
  Sparkles,
  Users,
  CreditCard,
  ShieldAlert,
  BarChart3,
  Cpu,
  CheckCircle2,
  TableProperties,
  GitBranch,
  BookOpen,
  Presentation,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const SECTIONS = [
  { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard, tag: 'KPIs' },
  { id: 'dataset-overview', label: '2. Dataset Overview', icon: Database, tag: '60K Rows' },
  { id: 'data-exploration', label: '3. Data Exploration', icon: Search, tag: 'Stats' },
  { id: 'data-cleaning', label: '4. Data Cleaning', icon: Sparkles, tag: 'Pipeline' },
  { id: 'customer-analysis', label: '5. Customer Analysis', icon: Users, tag: 'Demographics' },
  { id: 'transaction-analysis', label: '6. Transaction Analysis', icon: CreditCard, tag: 'Amounts' },
  { id: 'fraud-analysis', label: '7. Fraud Analysis', icon: ShieldAlert, tag: '4.46% Rate' },
  { id: 'data-visualization', label: '8. Data Visualization', icon: BarChart3, tag: '7 Charts' },
  { id: 'machine-learning', label: '9. ML & Fraud Detection', icon: Cpu, tag: 'Inference' },
  { id: 'model-evaluation', label: '10. Model Evaluation', icon: CheckCircle2, tag: 'Metrics' },
  { id: 'transaction-explorer', label: '11. Transaction Explorer', icon: TableProperties, tag: 'Filters' },
  { id: 'methodology', label: '12. Project Methodology', icon: GitBranch, tag: 'Workflow' },
  { id: 'conclusion', label: '13. Project Conclusion', icon: BookOpen, tag: 'Summary' },
];

export default function Sidebar({ activeSection, setActiveSection, onOpenPresentation, isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-navy-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6 text-navy-950 font-bold" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight leading-tight">
                DAE FRAUD SHIELD
              </h1>
              <span className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wide">
                Analytics &amp; ML System
              </span>
            </div>
          </div>
        </div>

        {/* Presentation Mode Button */}
        <div className="p-3">
          <button
            onClick={onOpenPresentation}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all group shadow-md"
          >
            <div className="flex items-center gap-2.5">
              <Presentation className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider">Professor Demo Mode</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500 text-navy-950 font-extrabold">
              VIVA
            </span>
          </button>
        </div>

        {/* Navigation Section List */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Project Navigation
          </div>

          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;

            return (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 text-cyan-300 border-l-4 border-cyan-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span className="truncate text-left">{sec.label}</span>
                </div>
                {sec.tag && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ml-1.5 font-mono ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {sec.tag}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Meta */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>DAE College Project</span>
            <span className="text-emerald-400">Verified 50K</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Credit Card Fraud Analysis &amp; Detection
          </p>
        </div>
      </aside>
    </>
  );
}
