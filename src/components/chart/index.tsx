'use client'

import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer } from '../ui/chart';
import { type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

export default function ChartOverView(){

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig

  const chartData = [
    { month: "Janeiro", desktop: 186, mobile: 80 },
    { month: "Fevereiro", desktop: 305, mobile: 200 },
    { month: "Março", desktop: 237, mobile: 120 },
    { month: "Abril", desktop: 73, mobile: 190 },
    { month: "Junho", desktop: 209, mobile: 130 },
    { month: "Julho", desktop: 214, mobile: 140 },
  ]

  return(
    <Card className='w-full md:w-1/2 md:max-w-[600px]'>
      <CardHeader>
        <div className='flex items-center justify-center'>
          <CardTitle className='text-lg sm:text-xl text-gray-800'>
            Overview Vendas
            <DollarSign className='ml-auto w-4 h-4' />
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className='min-h-[200px] w-full'>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false}/>
            <XAxis 
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value)=>value.slice(0,3)}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-desktop)" radius={4} />
          </BarChart>

        </ChartContainer>
      </CardContent>
    </Card>
  )
}