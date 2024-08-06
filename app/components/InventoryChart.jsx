// components/InventoryChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const InventoryChart = ({ inventory }) => {
  const labels = inventory.map(item => item.name);
  const data = inventory.map(item => item.quantity);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Quantity of Items',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Quantity: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="chartContainer">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default InventoryChart;
