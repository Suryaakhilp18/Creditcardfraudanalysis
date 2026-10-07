import React from 'react';
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

export default function AmountByFraudBarChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(d => d.status),
    datasets: [
      {
        label: 'Average Transaction Amount ($)',
        data: data.map(d => d.amount),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)', // Legitimate
          'rgba(239, 68, 68, 0.8)'    // Fraud
        ],
        borderColor: [
          '#10b981',
          '#ef4444'
        ],
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 64
      }
    ]
  };

  const options = {
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
          label: (context) => ` Average Amount: $${context.raw.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fraud Status',
          color: '#94a3b8',
          font: { family: 'Inter', size: 12, weight: '500' }
        },
        ticks: {
          color: '#cbd5e1',
          font: { size: 13, weight: '600' }
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Average Amount (INR/USD)',
          color: '#94a3b8',
          font: { family: 'Inter', size: 12, weight: '500' }
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          callback: (value) => `$${value.toLocaleString()}`
        },
        grid: {
          color: 'rgba(51, 65, 85, 0.25)'
        }
      }
    }
  };

  return (
    <div className="w-full h-72 sm:h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
}
