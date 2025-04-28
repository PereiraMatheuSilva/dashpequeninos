'use client';

import { useState } from 'react';
import { DateRangePicker } from '../../dateranger';
import { TotalsCard } from '../../totalcards';
import { Button } from "@/components/ui/button"
import { ButtonLoading } from '@/components/buttonLoading';
import { api } from '@/lib/api';
//import { BarChart } from './components/BarChat/index';

interface PacienteProps{
  numeroPacientesAtivos: string,
  numeroNovosPacientes: string,
  frequenciaMedia: string
}


export function PacientesAtivos(){
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [pacientes, setPacientes] = useState<PacienteProps>()
  

  const handleBuscar = async () => {
    if (!startDate || !endDate) {
      alert('Selecione o intervalo de datas.')
      return
    }

    setLoading(true);

    try {
      const [resPacientes] = await Promise.all([
        api.get('/api/pacientes', {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }),
      ]);
      
      setPacientes(resPacientes.data)
      
    
    
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
            <h1 className="text-2xl font-bold">Pacientes Ativos</h1>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            <TotalsCard title="Pacientes Ativos" value={
              pacientes ? `${pacientes.numeroPacientesAtivos}` : '0'
            } icon="dollar-sign" />

            <TotalsCard title="Novos Pacientes" value={
              pacientes ? `${pacientes.numeroNovosPacientes}` : '0'
            } icon="dollar-sign" />

            <TotalsCard title="Frequencia Média" value={
              pacientes ? `${Number(pacientes.frequenciaMedia).toFixed(2)}` : '0'
            } icon="dollar-sign" />

          </div>
          
          
      </div>
    
  )
}