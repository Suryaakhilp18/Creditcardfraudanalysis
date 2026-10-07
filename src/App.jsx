import React, { useState, useEffect } from 'react';
import Sidebar, { SECTIONS } from './components/Sidebar';
import Header from './components/Header';
import PresentationMode from './components/PresentationMode';
import { fetchSummaryData } from './data/dataService';

// Pages
import DashboardPage from './pages/DashboardPage';
import DatasetOverviewPage from './pages/DatasetOverviewPage';
import DataExplorationPage from './pages/DataExplorationPage';
import DataCleaningPage from './pages/DataCleaningPage';
import CustomerAnalysisPage from './pages/CustomerAnalysisPage';
import TransactionAnalysisPage from './pages/TransactionAnalysisPage';
import FraudAnalysisPage from './pages/FraudAnalysisPage';
import DataVisualizationPage from './pages/DataVisualizationPage';
import MachineLearningPage from './pages/MachineLearningPage';
import ModelEvaluationPage from './pages/ModelEvaluationPage';
import TransactionExplorerPage from './pages/TransactionExplorerPage';
import MethodologyPage from './pages/MethodologyPage';
import ConclusionPage from './pages/ConclusionPage';

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchSummaryData();
      setSummaryData(data);
    } catch (err) {
      console.error("Error loading summary data:", err);
    } finally {
      setLoading(false);
    }
  };

  const activeSectionObj = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];

  const renderActivePage = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <p className="text-sm font-semibold text-slate-400 animate-pulse">
            Processing Verified Credit Card Fraud Dataset (50,000 Records)...
          </p>
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage summaryData={summaryData} onNavigate={setActiveSection} />;
      case 'dataset-overview':
        return <DatasetOverviewPage summaryData={summaryData} />;
      case 'data-exploration':
        return <DataExplorationPage summaryData={summaryData} />;
      case 'data-cleaning':
        return <DataCleaningPage summaryData={summaryData} />;
      case 'customer-analysis':
        return <CustomerAnalysisPage summaryData={summaryData} />;
      case 'transaction-analysis':
        return <TransactionAnalysisPage summaryData={summaryData} />;
      case 'fraud-analysis':
        return <FraudAnalysisPage summaryData={summaryData} />;
      case 'data-visualization':
        return <DataVisualizationPage summaryData={summaryData} />;
      case 'machine-learning':
        return <MachineLearningPage summaryData={summaryData} />;
      case 'model-evaluation':
        return <ModelEvaluationPage summaryData={summaryData} />;
      case 'transaction-explorer':
        return <TransactionExplorerPage summaryData={summaryData} />;
      case 'methodology':
        return <MethodologyPage />;
      case 'conclusion':
        return <ConclusionPage summaryData={summaryData} />;
      default:
        return <DashboardPage summaryData={summaryData} onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1">
        {/* Sticky Header */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenPresentation={() => setIsPresentationOpen(true)}
          activeSectionName={activeSectionObj.label}
          kpis={summaryData?.kpis}
        />

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500">
          <p>
            Credit Card Fraud Analysis &amp; Detection System • College Data Analytics &amp; Engineering (DAE) Project
          </p>
          <p className="text-[11px] text-slate-600 mt-0.5">
            50,000 Verified Transactions • Whitelist Visualizations • Real-time AI Fraud Prediction Engine
          </p>
        </footer>
      </div>

      {/* Presentation Walkthrough Modal */}
      <PresentationMode
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        summaryData={summaryData}
      />
    </div>
  );
}
