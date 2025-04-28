'use client';

import { useState, useEffect } from 'react';
import { DateRangePicker } from '../../dateranger';
import { TotalsCard } from '../../totalcards';
import { LineChart } from '../../charts';
import { BarChart } from './components/BarChart';
import { api } from '@/lib/api';
import { Button } from "@/components/ui/button"
import { ButtonLoading } from '@/components/buttonLoading';

interface AtendimentoPorProfissionalData {
  profissional: string;
  count: number;
}

export function AtendimentosPorProfissional() {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [atendimentosPorProfissional, setAtendimentosPorProfissional] = useState<AtendimentoPorProfissionalData[]>([]);
  const [chartDataFormatted, setChartDataFormatted] = useState<{ [key: string]: number } | null>(null);

  useEffect(() => {
    // Formata os dados de atendimentos por profissional para o formato esperado pelo BarChart
    const formattedData: { [key: string]: number } = {};
    atendimentosPorProfissional.forEach(item => {
      formattedData[item.profissional] = item.count;
    });
    setChartDataFormatted(formattedData);
    // console.log('Dados formatados para o gráfico (profissional):', formattedData);
  }, [atendimentosPorProfissional]);

  const handleBuscar = async () => {
    if (!startDate || !endDate) {
      alert('Selecione o intervalo de datas.');
      return;
    }

    setLoading(true);

    try {
      const resProfissionais = await api.get('/api/dashboard/atendimento-profissional', {
        params: {
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        },
      });

      setAtendimentosPorProfissional(resProfissionais.data); // <---- ATUALIZE O NOME DO ESTADO
      console.log(resProfissionais.data)

    } catch (err) {
      console.error('Erro ao buscar dados por profissional:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen space-y-6">
      {/* Navegação */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Atendimentos Por Profissional</h1>
        <DateRangePicker
          onChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        {loading ? (
          <ButtonLoading />
        ) : (
          <Button onClick={handleBuscar}>Buscar</Button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Número de Atendimentos por Profissional</h2>

        {chartDataFormatted && <BarChart chartData={chartDataFormatted} />}

      </div>
    </div>
  );
}