// app/api/indicadores/media-atendimentos-profissionais/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function normalizarDatas(start: Date, end: Date) {
  const dataInicio = new Date(start);
  dataInicio.setHours(0, 0, 0, 0);

  const dataFim = new Date(end);
  dataFim.setHours(23, 59, 59, 999);

  return { dataInicio, dataFim };
}

async function calcularMediaAtendimentosPorProfissional(startDate: Date, endDate: Date) {
  const { dataInicio, dataFim } = normalizarDatas(startDate, endDate);

  try {
    const totalAtendimentos = await prisma.appointment.count({
      where: {
        date: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
    });

    const profissionaisUnicos = await prisma.appointment.groupBy({
      by: ['professionalId'],
      where: {
        date: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      _count: {
        professionalId: true,
      },
    });

    const numeroDeProfissionais = profissionaisUnicos.length;

    if (numeroDeProfissionais === 0) {
      return { mediaAtendimentos: 0, totalFuncionariosUnicos: 0 };
    }

    const mediaAtendimentos = totalAtendimentos / numeroDeProfissionais;
    return { mediaAtendimentos: parseFloat(mediaAtendimentos.toFixed(2)), totalFuncionariosUnicos: numeroDeProfissionais };
  } catch (error) {
    console.error("Erro ao calcular a média de atendimentos por profissional:", error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDateString = searchParams.get('startDate');
  const endDateString = searchParams.get('endDate');

  if (!startDateString || !endDateString) {
    return NextResponse.json({ message: 'As datas de início (startDate) e fim (endDate) são obrigatórias na query.' }, { status: 400 });
  }

  try {
    const startDate = new Date(startDateString as string);
    const endDate = new Date(endDateString as string);

    const resultados = await calcularMediaAtendimentosPorProfissional(startDate, endDate);

    return NextResponse.json({
      mediaAtendimentosPorProfissional: resultados.mediaAtendimentos,
      totalFuncionariosUnicos: resultados.totalFuncionariosUnicos,
    });
  } catch (error: any) {
    console.error('Erro ao buscar a média de atendimentos por profissional:', error);
    return NextResponse.json({ error: error.message || 'Erro ao buscar a média de atendimentos por profissional' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}