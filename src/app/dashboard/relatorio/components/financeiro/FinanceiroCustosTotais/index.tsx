'use client';

import { useState } from 'react';
import { DateRangePicker } from '../../dateranger';
import { TotalsCard } from '../../totalcards';
import { Button } from "@/components/ui/button"
import { ButtonLoading } from '@/components/buttonLoading';
import { api } from '@/lib/api';
import { BarChart } from './components/BarChat/index';


export function FinanceiroCustosTotais(){
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
      const [resFinanceiro] = await Promise.all([
        api.get('/api/financeiro', {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }),
      ]);
      
      console.log(resFinanceiro.data)
      
    
    
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
            <h1 className="text-2xl font-bold">Financeiro Custos Totais</h1>
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
          <h2 className="text-lg font-semibold mb-2">Custos Totais</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            <TotalsCard title="Custo Total" value={
              horarioPico ? `${horarioPico}` : '0'
            } icon="dollar-sign" />

          </div>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="text-lg font-semibold mb-2">Custos Totais</h2>
               

            

              <BarChart chartData={JSON.stringify(horarioPicoDetails, null, 2)}/>


            </div>

          </div>
          
      </div>
    
  )
}