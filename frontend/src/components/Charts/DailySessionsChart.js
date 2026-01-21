import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DailySessionsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible</div>;
  }

  const dates = data.map(item => item._id?.date || 'Inconnu');
  const sessions = data.map(item => item.count || 0);
  const weights = data.map(item => (item.totalWeight || 0) / 1000);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Sessions',
        data: sessions,
        backgroundColor: 'rgba(63, 81, 181, 0.6)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 1,
      },
      {
        label: 'Poids Total (tonnes)',
        data: weights,
        backgroundColor: 'rgba(255, 152, 0, 0.6)',
        borderColor: 'rgba(255, 152, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#fff' },
      },
      title: {
        display: true,
        text: 'Sessions par Jour',
        color: '#fff',
      },
    },
    scales: {
      y: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default DailySessionsChart;
