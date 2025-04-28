// app/page.js
'use client'

import { useState } from 'react';
import { Navibar } from './components/navibar';


// Importe os novos componentes
import { AtendimentosTotal } from './components/atendimentos/AtendimentosTotal';
import { AtendimentosMediaDiaria } from './components/atendimentos/AtendimentosMediaDiaria';
import { AtendimentosHorarioPico } from './components/atendimentos/AtendimentosHorarioPico';
import { AtendimentosPorEspecialidade } from './components/atendimentos/AtendimentosPorEspecialidade';
import { AtendimentosPorProfissional } from './components/atendimentos/AtendimentosPorProfissional';

import { FinanceiroReceitaBrutaTotal } from './components/financeiro/FinanceiroReceitaBrutaTotal';
import { FinanceiroReceitaLiquida } from './components/financeiro/FinanceiroReceitaLiquida';
import { FinanceiroCustosTotais } from './components/financeiro/FinanceiroCustosTotais';
import { FinanceiroLucroLiquido } from './components/financeiro/FinanceiroLucroLiquido';
import { FinanceiroTicketMedioBruto } from './components/financeiro/FinanceiroTicketMedioBruto';
import { FinanceiroTicketMedioLiquido } from './components/financeiro/FinanceiroTicketMedioLiquido';
import { FinanceiroPorProfissional } from './components/financeiro/FinanceiroPorProfissional';
import { FinanceiroPorServico } from './components/financeiro/FinanceiroPorServico';
import { FinanceiroPorFormaPagamento } from './components/financeiro/FinanceiroPorFormaPagamento';

import { PacientesAtivos } from './components/pacientes/PacientesAtivos';
import { PacientesNovos } from './components/pacientes/PacientesNovos';
import { PacientesFrequenciaMedia } from './components/pacientes/PacientesFrequenciaMedia';

import { OutrosMediaAtendimentos } from './components/outros/OutrosMediaAtendimentos';
import { OutrosValorRepassado } from './components/outros/OutrosValorRepassado';
import { OutrosTaxaNaoComparecimento } from './components/outros/OutrosTaxaNaoComparecimento';

// Defina um tipo para todas as seções válidas
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


export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('geral');
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleNavigation: (section: DashboardSection) => void = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="w-full min-h-screen p-6 space-y-6">
      {/* Navegação */}
      <Navibar onNavigate={handleNavigation} />

      {/* Conteúdo Principal */}
      {activeSection === 'geral' && (
        <>
          <AtendimentosTotal />
        </>
      )}

      {/* Novas seções de Atendimentos */}
      {activeSection === 'atendimentosTotal' && <AtendimentosTotal />}
      {activeSection === 'atendimentosMediaDiaria' && <AtendimentosMediaDiaria />}
      {activeSection === 'atendimentosHorarioPico' && <AtendimentosHorarioPico />}
      {activeSection === 'atendimentosPorEspecialidade' && <AtendimentosPorEspecialidade />}
      {activeSection === 'atendimentosPorProfissional' && <AtendimentosPorProfissional />}

      {/* Novas seções Financeiras */}
      {activeSection === 'financeiroReceitaBrutaTotal' && <FinanceiroReceitaBrutaTotal />}
      {activeSection === 'financeiroReceitaLiquida' && <FinanceiroReceitaLiquida />}
      {activeSection === 'financeiroCustosTotais' && <FinanceiroCustosTotais />}
      {activeSection === 'financeiroLucroLiquido' && <FinanceiroLucroLiquido />}
      {activeSection === 'financeiroTicketMedioBruto' && <FinanceiroTicketMedioBruto />}
      {activeSection === 'financeiroTicketMedioLiquido' && <FinanceiroTicketMedioLiquido />}
      {activeSection === 'financeiroPorProfissional' && <FinanceiroPorProfissional />}
      {activeSection === 'financeiroPorServico' && <FinanceiroPorServico />}
      {activeSection === 'financeiroPorFormaPagamento' && <FinanceiroPorFormaPagamento />}

      {/* Novas seções Pacientes */}
      {activeSection === 'pacientesAtivos' && <PacientesAtivos />}
      {activeSection === 'pacientesNovos' && <PacientesNovos />}
      {activeSection === 'pacientesFrequenciaMedia' && <PacientesFrequenciaMedia />}

      {/*Nova seções Profissionais */}
      {activeSection === 'outrosMediaAtendimentos' && <OutrosMediaAtendimentos />}
      {activeSection === 'outrosValorRepassado' && <OutrosValorRepassado />}
      {activeSection === 'outrosTaxaNaoComparecimento' && <OutrosTaxaNaoComparecimento />}



    </div>
      
  )
}