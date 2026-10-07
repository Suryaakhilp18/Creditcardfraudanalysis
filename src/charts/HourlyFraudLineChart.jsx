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

export default function HourlyFraudLineChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(d => d.hour_label),
    datasets: [
      {
        label: 'Fraud Rate (%)',
        data: data.map(d => d.fraud_rate),
        borderColor: '#f43f5e', // Rose / Red
        backgroundColor: 'rgba(244, 63, 94, 0.15)',
        borderWidth: 2.5,
        pointBackgroundColor: '#e11d48',
        pointBorderColor: '#fecdd3',
        pointRadius: 4.5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.35
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
          label: (context) => ` Fraud Incidence: ${context.raw}% of hourly transactions`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hour of Day (00:00 - 23:00)',
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 }
        },
        ticks: { color: '#cbd5e1', maxRotation: 45 },
        grid: { color: 'rgba(51, 65, 85, 0.25)' }
      },
      y: {
        title: {
          display: true,
          text: 'Fraud Rate (%)',
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
    <div className="w-full h-72 sm:h-80">
      <Line data={chartData} options={options} />
    </div>
  );
}
