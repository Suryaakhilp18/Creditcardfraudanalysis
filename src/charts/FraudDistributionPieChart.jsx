import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FraudDistributionPieChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(d => `${d.label} (${d.pct}%)`),
    datasets: [
      {
        data: data.map(d => d.value),
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)', // Legitimate - Emerald
          'rgba(239, 68, 68, 0.85)',   // Fraud - Crimson
        ],
        borderColor: [
          '#10b981',
          '#ef4444',
        ],
        borderWidth: 2,
        hoverOffset: 12
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 13, weight: '500' },
          padding: 20
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
          label: (context) => {
            const val = context.raw || 0;
            const item = data[context.dataIndex];
            return ` ${item.label}: ${val.toLocaleString()} transactions (${item.pct}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-72 sm:h-80 flex items-center justify-center">
      <Pie data={chartData} options={options} />
    </div>
  );
}
