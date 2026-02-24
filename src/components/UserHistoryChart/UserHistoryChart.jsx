import React from 'react';
import { Bar } from 'react-chartjs-2';
import './userHistoryChart.scss';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const UserHistoryChart = ({users}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',

      },
    },
    scales: {
      x: {
        ticks: {
          padding: 10,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={users} options={options} />;
};

export default UserHistoryChart;
