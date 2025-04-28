'use client';

import { useState } from 'react';
import { DateRangePicker } from '../../dateranger';
import { TotalsCard } from '../../totalcards';
import { Button } from "@/components/ui/button"
import { ButtonLoading } from '@/components/buttonLoading';
import { api } from '@/lib/api';


export function OutrosTaxaNaoComparecimento(){
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const [totalAtendimentos, setTotalAtendimentos] = useState<string>('')
  const [funcionariosUnicos, setFuncionariosUnicos] = useState<string>('')
  const [mediaAtendimentosProfissional, setMediaAtendimentosProfissional] = useState<string>('0'); // Novo estado


  const handleCalc = () =>{
    const value = Number(Number(totalAtendimentos) * 0.80)
    return value
  }


  const handleBuscar = async () => {
    if (!startDate || !endDate) {
      alert('Selecione o intervalo de datas.')
      return
    }

    setLoading(true);

    try {
      const [
        resAtendimentos,
        resMediaAtendimentosProfissional // Nova resposta
      ] = await Promise.all([
        api.get('/api/dashboard/total-atendimentos', {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }),
        api.get('/api/indicadores/media-atendimentos-profissionais', { // Nova chamada
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }),
      ]);



      setTotalAtendimentos(resAtendimentos.data.AtendimentoTotal);

      setMediaAtendimentosProfissional(resMediaAtendimentosProfissional.data.mediaAtendimentosPorProfissional);

      setFuncionariosUnicos(resMediaAtendimentosProfissional.data.totalFuncionariosUnicos)

    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  }

  return(
    <div className="w-full min-h-screen space-y-6">
      {/* Navegação */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between   gap-4">
        <h1 className="text-2xl font-bold">Outros Taxa Nao Comparecimento</h1>
        <DateRangePicker
          onChange={(start, end) => {
            setStartDate(start)
            setEndDate(end)
          }}
        />
        {loading ? (
          <ButtonLoading />
        ) : (
          <Button onClick={handleBuscar}>Buscar</Button>
        )}
      </div>
      <h2 className="text-lg font-semibold mb-2">(Não compareceu / Total) * 100</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">

        <TotalsCard title="Total atendimentos" value={
          totalAtendimentos ? totalAtendimentos : '0'
        } icon="calendar" />

        <TotalsCard title="Profissionais Ativos" value={
          funcionariosUnicos ? funcionariosUnicos : '0'
        } icon="activity" />

        {/* Novo card para a média de atendimentos por profissional */}
        <TotalsCard
          title="Média Atend. por Prof."
          value={mediaAtendimentosProfissional}
          icon="users"
        />

      </div>

      <h2 className="text-lg font-semibold mb-2">Custos / total de atendimento</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">

        <TotalsCard title="Total atendimentos" value={
          totalAtendimentos ? totalAtendimentos : '0'
        } icon="calendar" />

        {/* Novo card para o valor repassado */}
        <TotalsCard
          title="Valor repassado"
          value={handleCalc().toString()} // Convertendo para string aqui
          icon="users"
        />

      </div>


    </div>

  )
}