/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AttendanceChartProps {
  type?: 'line' | 'bar';
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ type: initialType = 'line' }) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>(initialType);

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Present',
        data: [85, 90, 92, 88, 95, 30, 20],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Absent',
        data: [15, 10, 8, 12, 5, 70, 80],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          // eslint-disable-next-line react-hooks/unsupported-syntax
          callback: function(this: any, tickValue: string | number) {
            return `${tickValue}%`;
          },
        },
        title: {
          display: true,
          text: 'Percentage',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Days',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'nearest' as const,
    },
  };

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: 'line' | 'bar'
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  return (
    <Box sx={{ position: 'relative', height: 300 }}>
      <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
        >
          <ToggleButton value="line">Line</ToggleButton>
          <ToggleButton value="bar">Bar</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {chartType === 'line' ? (
        <Line options={options} data={data} />
      ) : (
        <Bar options={options} data={data} />
      )}
    </Box>
  );
};

export default AttendanceChart;