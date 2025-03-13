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

export function DatePickerWithRange({ date, setDate }: { date: DateRange | undefined; setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>> }) {
  
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd 'de' LLLL 'de' yyyy", { locale: ptBR })} -{" "}
                  {format(date.to, "dd 'de' LLLL 'de' yyyy", { locale: ptBR })}
                </>
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
            defaultMonth={new Date()}
            selected={date}
            onSelect={(range) => setDate(range || undefined)}
            numberOfMonths={2}
          />
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

  async function fetchAtendimentos(startDate?: Date, endDate?: Date) {
    if (!startDate || !endDate) return;

    try {
      const response = await api.get("/api/dashboard/total-atendimentos", {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      setTotalAtendimentos(response.data.totalAtendimentos);
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

      <section className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-center'>
              <CardTitle className='text-lg sm:text-xl text-gray-600 select-none'>
                Custos Totais
              </CardTitle>
              <DollarSign className='ml-auto w-4 h-4' />
            </div>
            <CardDescription>
              Total de Custos em 90 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-base sm:text-lg font-bold'>R$ 0.00</p>
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
              R$ 150.000
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
