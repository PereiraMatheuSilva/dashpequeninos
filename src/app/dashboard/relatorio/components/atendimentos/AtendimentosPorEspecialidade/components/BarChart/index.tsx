'use client'

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useMemo } from 'react';


interface BarChartProps {
  chartData: { [key: string]: number } | null;
}

export function BarChart({ chartData }: BarChartProps) {
  const data = useMemo(() => {
    if (!chartData) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      };
    }

    const labels = Object.keys(chartData);
    const values = Object.values(chartData);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Qtdd Especialidade',
          data: values,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [chartData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value: number) => value.toString(),
        font: {
          weight: 'bold',
        },
        color: 'black',
      },
    },
  };

  return <Bar options={options} data={data} />;
}