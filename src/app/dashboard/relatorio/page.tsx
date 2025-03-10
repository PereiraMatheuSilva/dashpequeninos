import ChartOverView from '@/components/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, DollarSignIcon, Percent, Users } from 'lucide-react';

export default async function Relatorio() {
  return(
    <main className='p-4'>
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
            <p className='text-base sm:text-lg font-bold'>R$ 15.000,00</p>
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
            <p className='text-base sm:text-lg font-bold'>R$ 15.000,00</p>
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
            <p className='text-base sm:text-lg font-bold'>35</p>
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
            <p className='text-base sm:text-lg font-bold'>35</p>
          </CardContent>
        </Card>
      </section>

      <section className='mt-4 flex flex-col md:flex-row gap-4'>
        <ChartOverView>
          
        </ChartOverView>
      </section>

    </main>
    
  )
}