import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ChannelFraudBarChart({ data }) {
  const [viewMode, setViewMode] = useState('count'); // 'count' or 'rate'

  if (!data || data.length === 0) return null;

  const countChartData = {
    labels: data.map(d => d.channel),
    datasets: [
      {
        label: 'Legitimate (0.0)',
        data: data.map(d => d.legitimate),
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderColor: '#10b981',
        borderWidth: 1.5,
        borderRadius: 4
      },
      {
        label: 'Fraud (1.0)',
        data: data.map(d => d.fraud),
        backgroundColor: 'rgba(239, 68, 68, 0.85)',
        borderColor: '#ef4444',
        borderWidth: 1.5,
        borderRadius: 4
      }
    ]
  };

  const rateChartData = {
    labels: data.map(d => d.channel),
    datasets: [
      {
        label: 'Fraud Rate (%)',
        data: data.map(d => d.fraud_rate),
        backgroundColor: 'rgba(244, 63, 94, 0.85)',
        borderColor: '#f43f5e',
        borderWidth: 1.5,
        borderRadius: 4
      }
    ]
  };

  const countOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(51, 65, 85, 0.8)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${context.raw.toLocaleString()} txns`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Transaction Channel',
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 }
        },
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(51, 65, 85, 0.25)' }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Transactions',
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 }
        },
        ticks: {
          color: '#94a3b8',
          callback: (value) => value.toLocaleString()
        },
        grid: { color: 'rgba(51, 65, 85, 0.25)' }
      }
    }
  };

  const rateOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(51, 65, 85, 0.8)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => ` Fraud Rate: ${context.raw}%`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Transaction Channel',
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 }
        },
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(51, 65, 85, 0.25)' }
      },
      y: {
        title: {
          display: true,
          text: 'Fraud Incidence Rate (%)',
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 }
        },
        ticks: {
          color: '#94a3b8',
          callback: (value) => `${value}%`
        },
        grid: { color: 'rgba(51, 65, 85, 0.25)' }
      }
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-3">
        <div className="inline-flex rounded-lg bg-slate-800/80 p-1 border border-slate-700">
          <button
            onClick={() => setViewMode('count')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'count'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Transaction Counts (Ref Style)
          </button>
          <button
            onClick={() => setViewMode('rate')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'rate'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fraud Rate (%)
          </button>
        </div>
      </div>
      <div className="w-full h-72 sm:h-80">
        <Bar data={viewMode === 'count' ? countChartData : rateChartData} options={viewMode === 'count' ? countOptions : rateOptions} />
      </div>
    </div>
  );
}
