'use client'

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { useMemo } from 'react';



ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export function LineChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Atendimentos por Dia',
        data: [30, 50, 70, 90, 60],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  }

  return <Line data={data} />
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
            label: 'Atendimentos Mês',
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
          label: 'Atendimentos Mês',
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