'use client';

import { useState, useEffect } from 'react'; // Importe useEffect se quiser logar os dados transformados
import { DateRangePicker } from '../../dateranger';
import { TotalsCard } from '../../totalcards';
import { LineChart } from '../../charts';
import { BarChart } from './components/BarChart'; // Importe o BarChart
import { api } from '@/lib/api';
import { Button } from "@/components/ui/button"
import { ButtonLoading } from '@/components/buttonLoading';

interface AtendimentoPorEspecialidadeData {
  especialidade: string;
  count: number;
}

export function AtendimentosPorEspecialidade() {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [atendimentosPorEspecialidade, setAtendimentosPorEspecialidade] = useState<AtendimentoPorEspecialidadeData[]>([]);
  const [chartDataFormatted, setChartDataFormatted] = useState<{ [key: string]: number } | null>(null);

  useEffect(() => {
    // Formata os dados assim que o estado atendimentosPorEspecialidade é atualizado
    const formattedData: { [key: string]: number } = {};
    atendimentosPorEspecialidade.forEach(item => {
      formattedData[item.especialidade] = item.count;
    });
    setChartDataFormatted(formattedData);

  }, [atendimentosPorEspecialidade]);

  const handleBuscar = async () => {
    if (!startDate || !endDate) {
      alert('Selecione o intervalo de datas.');
      return;
    }

    setLoading(true);

    try {
      const resEspecialidades = await api.get('/api/dashboard/especialidade', {
        params: {
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        },
      });

      setAtendimentosPorEspecialidade(resEspecialidades.data);

    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen space-y-6">
      {/* Navegação */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Atendimentos Por Especialidade</h1>
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
        <h2 className="text-lg font-semibold mb-4">Número de Atendimentos por Especialidade</h2>

        {chartDataFormatted && <BarChart chartData={chartDataFormatted} />}

      </div>
    </div>
  );
}