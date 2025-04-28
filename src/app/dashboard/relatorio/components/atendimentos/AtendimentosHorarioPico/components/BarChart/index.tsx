'use client'

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useMemo } from 'react';

interface BarChartProps {
  chartData: string ;
}

export function BarChart({ chartData }: BarChartProps) {
  const data = useMemo(() => {
    if (!chartData) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Agendamentos por Horário',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      };
    }

    try {
      const appointments = JSON.parse(chartData) as { startTime: string }[];
      const hourlyCounts: { [key: string]: number } = {};

      appointments.forEach(appointment => {
        const date = new Date(appointment.startTime);
        // Subtrai 3 horas (em milissegundos)
        date.setTime(date.getTime() + 3 * 60 * 60 * 1000);
        const hour = date.getHours();
        hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
      });

      const sortedHours = Object.entries(hourlyCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 5);

      const labels = sortedHours.map(([hour]) => `${hour}h`);
      const values = sortedHours.map(([, count]) => count);

      return {
        labels: labels,
        datasets: [
          {
            label: 'Horário de Pico',
            data: values,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      };
    } catch (error) {
      console.error('Erro ao parsear chartData:', error);
      return {
        labels: [],
        datasets: [
          {
            label: 'Agendamentos por Horário',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      };
    }
  }, [chartData]);

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantidade de Agendamentos',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Horário',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Top 5 Horários de Pico',
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