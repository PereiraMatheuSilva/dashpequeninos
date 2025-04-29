'use client';

import { useState } from 'react';
import { DateRangePicker } from '../../dateranger';
import { TotalsCard } from '../../totalcards';
import { Button } from "@/components/ui/button"
import { ButtonLoading } from '@/components/buttonLoading';
import { api } from '@/lib/api';
import { BarChart } from './components/BarChart';


export function AtendimentosHorarioPico(){
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  
  const [totalAtendimentos, setTotalAtendimentos] = useState<string>('') 
  const [diasUteis, setDiasUteis] = useState<string>('') 
  const [totalAtendimentosMes, setTotalAtendimentosMes] = useState<string>('');
  const [totalDiaUtilMes, setTotalDiaUtilMes] = useState<string>('');
  const [horarioPico, setHorarioPico] = useState<string>('');
  const [horarioPicoDetails, setHorarioPicoDetails] = useState();



  const handleBuscar = async () => {
    if (!startDate || !endDate) {
      alert('Selecione o intervalo de datas.')
      return
    }

    setLoading(true);

    try {
      const [resAtendimentos, resAtendimentosMes, resHorarioPico] = await Promise.all([
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
        api.get('/api/dashboard/horario-pico', {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          }
        }),
      ]);



      setTotalAtendimentos(resHorarioPico.data.maxAtendimentos);
      setDiasUteis(resAtendimentos.data.diasUteis);

      setTotalAtendimentosMes(resAtendimentosMes.data.totalAtendimentos)
      setTotalDiaUtilMes(resAtendimentosMes.data.diasUteis)

      setHorarioPico(resHorarioPico.data.horarioPico)

      setHorarioPicoDetails(resHorarioPico.data.appointments)
    
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
            <h1 className="text-2xl font-bold">Horário de pico</h1>
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
          <h2 className="text-lg font-semibold mb-2">Horário de pico</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            <TotalsCard title="Dias Atend." value={
              diasUteis ? diasUteis : '0'
            } icon="calendar" />

            <TotalsCard title="Total Atendimentos" value={
              totalAtendimentos ? totalAtendimentos : '0'
            } icon="dollar-sign" />

            <TotalsCard title="Horário Pico" value={
              horarioPico ? `${horarioPico}` : '0'
            } icon="dollar-sign" />

          </div>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="text-lg font-semibold mb-2">Horário de pico</h2>
               

            

              <BarChart chartData={JSON.stringify(horarioPicoDetails, null, 2)}/>


            </div>

          </div>
          
      </div>
    
  )
}