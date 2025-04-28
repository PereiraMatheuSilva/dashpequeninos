import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function normalizarDatas(start: Date, end: Date) {
  const dataInicio = new Date(start);
  dataInicio.setHours(0, 0, 0, 0);

  const dataFim = new Date(end);
  dataFim.setHours(23, 59, 59, 999);

  return { dataInicio, dataFim };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateString = searchParams.get('startDate');
    const endDateString = searchParams.get('endDate');

    if (!startDateString || !endDateString) {
      return NextResponse.json({ message: 'Datas de início e fim são obrigatórias.' }, { status: 400 });
    }

    const { dataInicio, dataFim } = normalizarDatas(new Date(startDateString), new Date(endDateString));

    const whereClauseAppointments = {
      date: {
        gte: dataInicio,
        lte: dataFim,
      },
    };

    const whereClauseCustos = {
      createdAt: {
        gte: dataInicio,
        lte: dataFim,
      },
    };

    const appointments = await prisma.appointment.findMany({
      where: whereClauseAppointments,
      include: {
        professional: {
          select: {
            name: true,
          },
        },
        service: {
          select: {
            name: true,
            value: true,
          },
        },
      },
    });

    const custos = await prisma.custos.findMany({
      where: whereClauseCustos,
    });

    // 1. Receita Bruta Total (Valor Total Agendado)
    const receitaBrutaTotal = appointments.reduce((sum, appointment) => sum + appointment.value, 0);

    // 2. Receita Líquida da Clínica
    const receitaLiquidaClinica = appointments.reduce((sum, appointment) => sum + (appointment.value * 0.20), 0);

    // 3. Custos Totais da Clínica
    const custosTotaisClinica = custos.reduce((sum, custo) => sum + parseFloat(custo.value), 0);

    // 4. Lucro Líquido da Clínica
    const lucroLiquidoClinica = receitaLiquidaClinica - custosTotaisClinica;

    // 5. Ticket Médio Bruto (por atendimento)
    const totalAtendimentos = appointments.length;
    const ticketMedioBruto = totalAtendimentos > 0 ? receitaBrutaTotal / totalAtendimentos : 0;

    // 6. Ticket Médio Líquido da Clínica (por atendimento)
    const ticketMedioLiquidoClinica = totalAtendimentos > 0 ? receitaLiquidaClinica / totalAtendimentos : 0;

    // 7. Receita Bruta por Profissional
    const receitaBrutaPorProfissionalMap: { [key: string]: number } = {};
    appointments.forEach(appointment => {
      const nomeProfissional = appointment.professional?.name?.trim();
      if (nomeProfissional) {
        receitaBrutaPorProfissionalMap[nomeProfissional] =
          (receitaBrutaPorProfissionalMap[nomeProfissional] || 0) + appointment.value;
      }
    });
    const receitaBrutaPorProfissional = Object.entries(receitaBrutaPorProfissionalMap).map(
      ([profissional, valor]) => ({ profissional, valor })
    );

    // 8. Receita Bruta por Serviço
    const receitaBrutaPorServicoMap: { [key: string]: number } = {};
    appointments.forEach(appointment => {
      const nomeServico = appointment.service?.name?.trim();
      if (nomeServico && appointment.service?.value) {
        receitaBrutaPorServicoMap[nomeServico] =
          (receitaBrutaPorServicoMap[nomeServico] || 0) + parseFloat(appointment.service.value.toString());
      }
    });
    const receitaBrutaPorServico = Object.entries(receitaBrutaPorServicoMap).map(
      ([servico, valor]) => ({ servico, valor })
    );

    return NextResponse.json({
      receitaBrutaTotal,
      receitaLiquidaClinica,
      custosTotaisClinica,
      lucroLiquidoClinica,
      ticketMedioBruto,
      ticketMedioLiquidoClinica,
      receitaBrutaPorProfissional,
      receitaBrutaPorServico,
    });
  } catch (error) {
    console.error('Erro ao buscar dados de receita e custos:', error);
    return NextResponse.json({ message: 'Erro ao buscar os dados.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}