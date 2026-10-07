import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GenderDistributionPieChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(d => `${d.gender} (${d.pct}%)`),
    datasets: [
      {
        data: data.map(d => d.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.85)', // Male - Blue
          'rgba(236, 72, 153, 0.85)', // Female - Pink
          'rgba(168, 85, 247, 0.85)', // Other - Purple
        ],
        borderColor: [
          '#3b82f6',
          '#ec4899',
          '#a855f7',
        ],
        borderWidth: 2,
        hoverOffset: 10
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
            const count = context.raw || 0;
            const item = data[context.dataIndex];
            return ` ${item.gender}: ${count.toLocaleString()} customers (${item.pct}%)`;
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
