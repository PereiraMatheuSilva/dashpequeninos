'use client';
import { useState } from 'react';
import { DateRangePicker } from '../../dateranger';
import { TotalsCard } from '../../totalcards';
import { BarChart, LineChart } from '../../charts';
import { Button } from "@/components/ui/button"
import { ButtonLoading } from '@/components/buttonLoading';
import { api } from '@/lib/api';
import { FinanceiroData } from '@/utils/financeiro.type';


export function FinanceiroTicketMedioLiquido(){
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [totalAtendimentos, setTotalAtendimentos] = useState<string>('') 
  const [receitaBruta, setReceitaBruta] = useState<string>('') 
  const [diasUteis, setDiasUteis] = useState<string>('') 
  const [loading, setLoading] = useState(false);
  const [atendimentosPorDia, setAtendimentosPorDia] = useState<{ [key: string]: number } | null>(null);
  const [financeiro, setFinanceiro] = useState<FinanceiroData>()



  const handleBuscar = async () => {
    if (!startDate || !endDate) {
      alert('Selecione o intervalo de datas.')
      return
    }

    setLoading(true);

    try {
      const [resAtendimentos, resReceita, resFinanceiro] = await Promise.all([
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
          }
        }),
      ]);



      setTotalAtendimentos(resAtendimentos.data.AtendimentoTotal);
      setDiasUteis(resAtendimentos.data.diasUteis);
      setReceitaBruta(resReceita.data.receitaTotal);
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
            <h1 className="text-2xl font-bold">Ticket Medio (Liquido)</h1>
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
          <h2 className="text-lg font-semibold mb-2">Ticket Medio (Liquido)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            <TotalsCard title="Receita Total." value={
              financeiro?.receitaBrutaTotal ? `R$ ${financeiro?.receitaBrutaTotal.toFixed(1)}` : '0,00'
            } icon="calendar" />

            <TotalsCard title="Lucro Liquido Clinica" value={
              financeiro?.lucroLiquidoClinica ? `R$ ${financeiro?.lucroLiquidoClinica.toFixed(1)}` : '0,00'
            } icon="dollar-sign" />

            <TotalsCard title="Total Atendimentos" value={
              totalAtendimentos ? totalAtendimentos : '0'
            } icon="dollar-sign" />

            <TotalsCard title="Ticket Medio Liquido" value={
              financeiro?.ticketMedioLiquidoClinica ? `R$ ${financeiro?.ticketMedioLiquidoClinica.toFixed(2)}` : '0,00'
            } icon="dollar-sign" />



          </div>
          
      </div>
    
  )
}