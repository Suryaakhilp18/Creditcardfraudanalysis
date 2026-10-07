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

export default function AmountHistogramChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(d => d.bin_label),
    datasets: [
      {
        label: 'Frequency',
        data: data.map(d => d.count),
        backgroundColor: 'rgba(6, 182, 212, 0.75)',
        borderColor: '#06b6d4',
        borderWidth: 1.5,
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(6, 182, 212, 0.95)'
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
          label: (context) => {
            const count = context.raw || 0;
            const item = data[context.dataIndex];
            return ` Frequency: ${count.toLocaleString()} transactions (${item.pct}% of total)`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Transaction Amount Range ($)',
          color: '#94a3b8',
          font: { family: 'Inter', size: 12, weight: '500' }
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 25
        },
        grid: {
          color: 'rgba(51, 65, 85, 0.25)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Frequency (Count)',
          color: '#94a3b8',
          font: { family: 'Inter', size: 12, weight: '500' }
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          callback: (value) => value.toLocaleString()
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
