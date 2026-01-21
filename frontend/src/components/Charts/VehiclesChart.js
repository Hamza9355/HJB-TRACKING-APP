import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const VehiclesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible</div>;
  }

  const labels = data.map(item => item._id || 'Inconnu');
  const counts = data.map(item => item.count || 0);

  const chartData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: [
          'rgba(63, 81, 181, 0.6)',
          'rgba(255, 152, 0, 0.6)',
          'rgba(244, 67, 54, 0.6)',
          'rgba(76, 175, 80, 0.6)',
        ],
        borderColor: [
          'rgba(63, 81, 181, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(244, 67, 54, 1)',
          'rgba(76, 175, 80, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#fff' },
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Distribution des Véhicules',
        color: '#fff',
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default VehiclesChart;
