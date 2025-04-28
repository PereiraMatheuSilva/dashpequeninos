'use client';

import { useState } from 'react';
import { DateRangePicker } from '../../dateranger';
import { TotalsCard } from '../../totalcards';
import { Button } from "@/components/ui/button"
import { ButtonLoading } from '@/components/buttonLoading';
import { api } from '@/lib/api';
import { BarChart } from './components/Barchart';
import { FinanceiroData } from '@/utils/financeiro.type';


export function FinanceiroReceitaBrutaTotal(){
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  
  const [totalAtendimentos, setTotalAtendimentos] = useState<string>('') 
  const [diasUteis, setDiasUteis] = useState<string>('') 
  const [finaceiro, setFinanceiro] = useState<FinanceiroData>();

  const handleBuscar = async () => {
    if (!startDate || !endDate) {
      alert('Selecione o intervalo de datas.')
      return
    }

    setLoading(true);

    try {
      const [resAtendimentos, resReceitaTotais, resFinanceiro] = await Promise.all([
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
        api.get('/api/financeiro', {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }),
      ]);


      setDiasUteis(resAtendimentos.data.diasUteis);
      setTotalAtendimentos(resAtendimentos.data.AtendimentoTotal)
      setFinanceiro(resFinanceiro.data)


    
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
            <h1 className="text-2xl font-bold">Receita Bruta Total</h1>
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
          <h2 className="text-lg font-semibold mb-2">Receita Bruta Total</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            <TotalsCard title="Dias Atend." value={
              diasUteis ? diasUteis : '0'
            } icon="calendar" />

            <TotalsCard title="Total Atendimentos" value={
              totalAtendimentos ? totalAtendimentos : '0'
            } icon="dollar-sign" />

            <TotalsCard title="Receita Bruta Total" value={
              finaceiro ? `${Number(finaceiro.receitaBrutaTotal)}` : '0'
            } icon="dollar-sign" />

          </div>
          
      </div>
    
  )
}