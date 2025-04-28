// app/api/indicadores/taxa-nao-comparecimento/route.ts
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

async function calcularTaxaDeNaoComparecimento(startDate: Date, endDate: Date) {
  const { dataInicio, dataFim } = normalizarDatas(startDate, endDate);

  try {
    const naoCompareceuCount = await prisma.appointment.count({
      where: {
        date: {
          gte: dataInicio,
          lte: dataFim,
        },
        status: 'Não Compareceu',
      },
    });

    const totalAgendados = await prisma.appointment.count({
      where: {
        date: {
          gte: dataInicio,
          lte: dataFim,
        },
        status: {
          in: ['Realizado', 'Não Compareceu'],
        },
      },
    });

    if (totalAgendados === 0) {
      return 0; // Evitar divisão por zero
    }

    const taxaNaoComparecimento = (naoCompareceuCount / totalAgendados) * 100;
    return taxaNaoComparecimento;
  } catch (error) {
    console.error("Erro ao calcular a taxa de não comparecimento:", error);
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

    const taxa = await calcularTaxaDeNaoComparecimento(startDate, endDate);

    return NextResponse.json({ taxaNaoComparecimento: taxa.toFixed(2) });
  } catch (error: any) {
    console.error('Erro ao buscar a taxa de não comparecimento:', error);
    return NextResponse.json({ error: error.message || 'Erro ao buscar a taxa de não comparecimento' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}