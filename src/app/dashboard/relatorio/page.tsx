'use client'

import * as React from "react"
import ChartOverView from '@/components/chart';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DollarSign, DollarSignIcon, Percent, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { ptBR } from "date-fns/locale"  // Adicionando suporte ao português
import { api } from '@/lib/api';
import { useState, useEffect } from 'react';

export function DatePickerWithRange({
  date,
  setDate
}: {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}) {
  const hoje = new Date();

  // Sempre inicia com a data de hoje para ambos os campos
  useEffect(() => {
    if (!date) {
      setDate({ from: hoje, to: hoje });
    }
  }, [date, setDate]);

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                `${format(date.from, "dd 'de' LLLL 'de' yyyy", { locale: ptBR })} - ${format(date.to, "dd 'de' LLLL 'de' yyyy", { locale: ptBR })}`
              ) : (
                format(date.from, "dd 'de' LLLL 'de' yyyy", { locale: ptBR })
              )
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            locale={ptBR}
            initialFocus
            mode="range"
            defaultMonth={hoje}
            selected={date}
            onSelect={(range) => setDate(range || { from: hoje, to: hoje })}
            numberOfMonths={2}
          />
          <div className="p-2">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setDate({ from: hoje, to: hoje })}
            >
              Resetar para hoje
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}


export default function Relatorio() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });

  const [totalAtendimentos, setTotalAtendimentos] = useState<number | null>(null);
  const [custosTotais, setCustosTotais] = useState<number | null>(null);
  const [receitaTotal, setReceitaTotal] = useState<number | null>(null);

  async function fetchAtendimentos(startDate?: Date, endDate?: Date) {
    if (!startDate || !endDate) return;

    try {
      const total_atendimento = await api.get("/api/dashboard/total-atendimentos", {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });


      const custos = await api.get('/api/dashboard/custos-totais', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },       
      })

      const receita = await api.get('/api/dashboard/receita-total', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },       
      })




      console.log(`Custos Totais`, custos)
      console.log(`Receita Totais`, receita)
      console.log(`Total Atendimentos`, total_atendimento)

      setReceitaTotal(receita.data.receitaTotal)
      setCustosTotais(custos.data.custosTotais)
      setTotalAtendimentos(total_atendimento.data.totalAtendimentos);
    } catch (error) {
      console.error("Erro ao buscar atendimentos:", error);
    }
  }

  useEffect(() => {
    if (date?.from && date?.to) {
      fetchAtendimentos(date.from, date.to);
    }
  }, [date]);


  return (
    <main className='p-4'>
      <section className='grid-cols-1 mb-2'>
        <DatePickerWithRange date={date} setDate={setDate} />

      </section>

      <section className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-center'>
              <CardTitle className='text-lg sm:text-xl text-gray-600 select-none'>
                Lucro Total
              </CardTitle>
              <DollarSign className='ml-auto w-4 h-4' />
            </div>
            <CardDescription>
              Lucro em 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-base sm:text-lg font-bold'>R$ {custosTotais}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className='flex items-center justify-center'>
              <CardTitle className='text-lg sm:text-xl text-gray-600 select-none'>
                Custos Totais
              </CardTitle>
              <DollarSign className='ml-auto w-4 h-4' />
            </div>
            <CardDescription>
              Total de Custos em 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-base sm:text-lg font-bold'>R$ {custosTotais}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className='flex items-center justify-center'>
              <CardTitle className='text-lg sm:text-xl text-gray-600 select-none'>
                Total de Receita
              </CardTitle>
              <DollarSignIcon className='ml-auto w-4 h-4' />
            </div>
            <CardDescription>
              Total de receitas em 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-base sm:text-lg font-bold'>
              R$ {receitaTotal}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className='flex items-center justify-center'>
              <CardTitle className='text-lg sm:text-xl text-gray-600 select-none'>
                Atendimentos Hoje
              </CardTitle>
              <Percent className='ml-auto w-4 h-4' />
            </div>
            <CardDescription>
              Total de Atendimentos Hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-base sm:text-lg font-bold'>{totalAtendimentos}</p>
          </CardContent>
        </Card>

      </section>

      <section className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-center'>
              <CardTitle className='text-lg sm:text-xl text-gray-600 select-none'>
                Ticket Medio
              </CardTitle>
              <DollarSignIcon className='ml-auto w-4 h-4' />
            </div>
            <CardDescription>
              Ticket Medio em 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-base sm:text-lg font-bold'>
              R$ {receitaTotal}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className='flex items-center justify-center'>
              <CardTitle className='text-lg sm:text-xl text-gray-600 select-none'>
                Média Diária
              </CardTitle>
              <Percent className='ml-auto w-4 h-4' />
            </div>
            <CardDescription>
              Média Diária
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-base sm:text-lg font-bold'>{totalAtendimentos}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className='flex items-center justify-center'>
              <CardTitle className='text-lg sm:text-xl text-gray-600 select-none'>
                Atendimentos Hoje
              </CardTitle>
              <Percent className='ml-auto w-4 h-4' />
            </div>
            <CardDescription>
              Total de Atendimentos Hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-base sm:text-lg font-bold'>0</p>
          </CardContent>
        </Card>
      </section>



      <section className='mt-4 flex flex-col md:flex-row gap-4'>
        <ChartOverView />
      </section>
    </main>
  );
}
