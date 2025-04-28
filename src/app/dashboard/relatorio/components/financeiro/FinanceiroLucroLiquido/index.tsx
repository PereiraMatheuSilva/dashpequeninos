import { DateRangePicker } from '../../dateranger';
import { TotalsCard } from '../../totalcards';
import { BarChart, LineChart } from '../../charts';


export function FinanceiroLucroLiquido(){
  return(
      <div className="w-full min-h-screen space-y-6">
          {/* Navegação */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between   gap-4">
            <h1 className="text-2xl font-bold">Financeiro Lucro Liquido</h1>
            <DateRangePicker />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <TotalsCard title="Atendimentos" value="234" icon="calendar" />
            <TotalsCard title="Receita Bruta" value="R$ 10.500" icon="dollar-sign" />
            <TotalsCard title="Lucro Líquido" value="R$ 3.200" icon="trending-up" />
            <TotalsCard title="Taxa Ocupação" value="72%" icon="activity" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="text-lg font-semibold mb-2">Atendimentos por Dia</h2>
              <LineChart />
            </div>
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="text-lg font-semibold mb-2">Receita por Profissional</h2>
              <BarChart />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Detalhamento</h2>
            <p className="text-gray-500">Tabela com dados detalhados aqui...</p>
          </div>
      </div>
    
  )
}