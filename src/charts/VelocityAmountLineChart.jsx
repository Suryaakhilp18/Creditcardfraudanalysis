import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function VelocityAmountLineChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(d => `${d.transactions_last_24h} txns`),
    datasets: [
      {
        label: 'Average Transaction Amount ($)',
        data: data.map(d => d.avg_amount),
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
        borderWidth: 2.5,
        pointBackgroundColor: '#0284c7',
        pointBorderColor: '#bae6fd',
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.3
      }
    ]
  };

  const options = {
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
          label: (context) => ` Average Amount: $${context.raw.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Transactions in Last 24 Hours (Velocity)',
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 }
        },
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(51, 65, 85, 0.25)' }
      },
      y: {
        title: {
          display: true,
          text: 'Average Transaction Amount ($)',
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 }
        },
        ticks: {
          color: '#94a3b8',
          callback: (value) => `$${value.toLocaleString()}`
        },
        grid: { color: 'rgba(51, 65, 85, 0.25)' }
      }
    }
  };

  return (
    <div className="w-full h-72 sm:h-80">
      <Line data={chartData} options={options} />
    </div>
  );
}
