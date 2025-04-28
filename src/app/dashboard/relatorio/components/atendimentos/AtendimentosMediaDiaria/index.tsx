'use client';
import { useState } from 'react';
import { DateRangePicker } from '../../dateranger';
import { TotalsCard } from '../../totalcards';
import { BarChart } from './BarChartGrafico';
import { Button } from "@/components/ui/button"
import { ButtonLoading } from '@/components/buttonLoading';
import { api } from '@/lib/api';


export function AtendimentosMediaDiaria(){
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [totalAtendimentos, setTotalAtendimentos] = useState<string>('') 
  const [receitaBruta, setReceitaBruta] = useState<string>('') 
  const [diasUteis, setDiasUteis] = useState<string>('') 
  const [loading, setLoading] = useState(false);
  const [atendimentosPorDia, setAtendimentosPorDia] = useState<{ [key: string]: number } | null>(null);
  const [totalAtendimentosMes, SetTotalAtendimentosMes] = useState<string>('');
  const [totalReceitaMes, SetTotalReceitaMes] = useState<string>('');
  const [totalDiaUtilMes, SetTotalDiaUtilMes] = useState<string>('');



  const handleBuscar = async () => {
    if (!startDate || !endDate) {
      alert('Selecione o intervalo de datas.')
      return
    }

    setLoading(true);

    try {
      const [resAtendimentos, resReceita, resAtendimentosMes] = await Promise.all([
        api.get('/api/dashboard/total-atendimentos', {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }),
        api.get('/api/dashboard/receita-total', {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }),
        api.get('/api/dashboard/atendimentos-do-mes', {}),
      ]);



      setTotalAtendimentos(resAtendimentos.data.AtendimentoTotal);
      setDiasUteis(resAtendimentos.data.diasUteis);
      setReceitaBruta(resReceita.data.receitaTotal);
      setAtendimentosPorDia(resAtendimentosMes.data.atendimentosPorDia);

      SetTotalAtendimentosMes(resAtendimentosMes.data.totalAtendimentos)
      SetTotalReceitaMes(resAtendimentosMes.data.totalReceita)
      SetTotalDiaUtilMes(resAtendimentosMes.data.diasUteis)

    
    } catch (err) {
      console.error('Erro ao buscar atendimentos:', err);      
    } finally {
      setLoading(false);
    }
  }

  return(
      <div className="w-full min-h-screen space-y-6">
          {/* Navegação */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between   gap-4">
            <h1 className="text-2xl font-bold">Atendimentos Média Diária</h1>
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
          <h2 className="text-lg font-semibold mb-2">Média por Dia</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <TotalsCard title="Total Atendimentos" value={
              totalAtendimentos ? totalAtendimentos : '0'
            } icon="dollar-sign" />


            <TotalsCard title="Dias Atend." value={
              diasUteis ? diasUteis : '0'
            } icon="calendar" />

            <TotalsCard title="Média dia" value={
              diasUteis ? `${(Number(totalAtendimentos) / Number(diasUteis)).toFixed(2)}` : '0'
            } icon="dollar-sign" />

          </div>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="text-lg font-semibold mb-2">Média por Mês</h2>
              {atendimentosPorDia && <BarChart chartData={atendimentosPorDia} />} 

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            <TotalsCard title="Total Atendimentos" value={
              totalAtendimentosMes ? totalAtendimentosMes : '0'
            } icon="dollar-sign" />

            <TotalsCard title="Dias Atend." value={
              totalDiaUtilMes ? totalDiaUtilMes : '0'
            } icon="calendar" />

            <TotalsCard title="Media Mês" value={
              totalReceitaMes ? `${(Number(totalAtendimentosMes) / Number(totalDiaUtilMes)).toFixed(2)}` : '0,00'
            } icon="dollar-sign" />

          </div>
          </div>
          
      </div>
    
  )
}