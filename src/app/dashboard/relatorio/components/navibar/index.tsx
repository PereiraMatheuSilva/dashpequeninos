// components/navibar.js
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DashboardSection = 'geral' | 'financeiro' | 'pacientes' | 'profissionais' | 'especiais' |
                         'atendimentosTotal' | 'atendimentosMediaDiaria' | 'atendimentosHorarioPico' |
                         'atendimentosTaxaOcupacaoSalas' | 'atendimentosPorEspecialidade' |
                         'atendimentosPorProfissional' | 'financeiroReceitaBrutaTotal' |
                         'financeiroReceitaLiquida' | 'financeiroCustosTotais' |
                         'financeiroLucroLiquido' | 'financeiroTicketMedioBruto' |
                         'financeiroTicketMedioLiquido' | 'financeiroPorProfissional' |
                         'financeiroPorServico' | 'financeiroPorFormaPagamento' |
                         'pacientesAtivos' | 'pacientesNovos' | 'pacientesFrequenciaMedia' |
                         'outrosMediaAtendimentos' | 'outrosValorRepassado' |
                         'outrosTaxaNaoComparecimento' | 'outrosCustoPorAtendimento';

interface NavibarProps {
  onNavigate: (section: DashboardSection) => void;
}

export function Navibar({ onNavigate }: NavibarProps) {
  return (
    <nav className="w-full p-4 flex gap-4 text-black border rounded-md">
      {/* Dropdown 1 - Gerais e Operacionais */}
      <DropdownMenu>
        <DropdownMenuTrigger className="font-semibold px-4 py-2 border-r hover:bg-gray-100 active:bg-gray-200 transition-colors rounded-md">
          Indicadores Gerais e Operacionais
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[350px]">
          <DropdownMenuLabel>Total de Atendimentos</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('atendimentosTotal')}>Contar "Realizado" ou "Confirmado"</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Média Diária de Atendimentos</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('atendimentosMediaDiaria')}>Total ÷ dias</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Horário de Pico</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('atendimentosHorarioPico')}>Maior nº de agendamentos</DropdownMenuItem>
          <DropdownMenuSeparator />



          <DropdownMenuLabel>Por Especialidade</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('atendimentosPorEspecialidade')}>Agrupar por especialidade</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Por Profissional</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('atendimentosPorProfissional')}>Agrupar por profissional</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dropdown 2 - Financeiros */}
      <DropdownMenu>
        <DropdownMenuTrigger className="font-semibold px-4 py-2 border-r hover:bg-gray-100 active:bg-gray-200 transition-colors rounded-md">
          Indicadores Financeiros
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[400px]">
          <DropdownMenuLabel>Receita Bruta Total</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('financeiroReceitaBrutaTotal')}>Soma total dos atendimentos</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Receita Líquida da Clínica</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('financeiroReceitaLiquida')}>Total dos atendimentos × 0.20</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Custos Totais da Clínica</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('financeiroCustosTotais')}>Soma de todas as despesas</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Lucro Líquido da Clínica</DropdownMenuLabel>
          <DropdownMenuItem >Receita Líquida − Custos</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Ticket Médio Bruto (por atendimento)</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('financeiroTicketMedioBruto')}>Receita Bruta ÷ Total de Atendimentos</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Ticket Médio Líquido da Clínica (por atendimento)</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('financeiroTicketMedioLiquido')}>Receita Líquida ÷ Total de Atendimentos</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Receita Bruta por Profissional</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('financeiroPorProfissional')}>Soma do valor dos atendimentos por profissional</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Receita Bruta por Serviço</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('financeiroPorServico')}>Soma do valor por tipo de serviço</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Receita Bruta por Forma de Pagamento</DropdownMenuLabel>
          <DropdownMenuItem >Soma do valor por forma de pagamento</DropdownMenuItem>
          <DropdownMenuSeparator />

        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dropdown 3 - Pacientes */}
      <DropdownMenu>
        <DropdownMenuTrigger className="font-semibold px-4 py-2 border-r hover:bg-gray-100 active:bg-gray-200 transition-colors rounded-md">
          Indicadores de Pacientes
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[350px]">
          <DropdownMenuLabel>Pacientes Ativos</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('pacientesAtivos')}>Atendimento por período</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Novos Pacientes</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('pacientesAtivos')}>Primeiro atendimento no período</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Frequência Média</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('pacientesAtivos')}>Total de atendimentos ÷ nº de pacientes</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dropdown 4 - Profissionais */}
      <DropdownMenu>
        <DropdownMenuTrigger className="font-semibold px-4 py-2 border-r hover:bg-gray-100 active:bg-gray-200 transition-colors rounded-md">
          Indicadores de Profissionais
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[350px]">
          <DropdownMenuLabel>Média de Atendimentos</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('outrosMediaAtendimentos')}>Total ÷ nº de profissionais ativos</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Valor Repassado</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('outrosMediaAtendimentos')}>Atendimento × 0.80 por profissional</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dropdown 5 - Especiais */}
      <DropdownMenu>
        <DropdownMenuTrigger className="font-semibold px-4 py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors rounded-md">
          Indicadores Especiais
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[350px]">
          <DropdownMenuLabel>Taxa de Não Comparecimento</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onNavigate('outrosTaxaNaoComparecimento')}>("Não Compareceu" ÷ total) × 100</DropdownMenuItem>
          <DropdownMenuSeparator />

        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}