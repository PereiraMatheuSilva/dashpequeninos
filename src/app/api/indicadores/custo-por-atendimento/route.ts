// app/api/indicadores/custo-por-atendimento/route.ts
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

async function calcularCustoPorAtendimento(startDate: Date, endDate: Date) {
  const { dataInicio, dataFim } = normalizarDatas(startDate, endDate);

  try {
    // Buscar todos os custos entre as datas
    const custos = await prisma.custos.findMany({
      where: {
        createdAt: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      select: {
        value: true,
      },
    });

    // Somar os valores convertendo para número
    const valorTotalCustos = custos.reduce((total, custo) => {
      const valor = parseFloat(custo.value);
      return total + (isNaN(valor) ? 0 : valor);
    }, 0);

    // Contar atendimentos
    const totalAtendimentos = await prisma.appointment.count({
      where: {
        date: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
    });

    if (totalAtendimentos === 0) {
      return 0; // Evitar divisão por zero
    }

    const custoPorAtendimento = valorTotalCustos / totalAtendimentos;
    return custoPorAtendimento;
  } catch (error) {
    console.error("Erro ao calcular o custo por atendimento:", error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDateString = searchParams.get('startDate');
  const endDateString = searchParams.get('endDate');

  if (!startDateString || !endDateString) {
    return NextResponse.json(
      { message: 'As datas de início (startDate) e fim (endDate) são obrigatórias na query.' },
      { status: 400 }
    );
  }

  try {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    const custo = await calcularCustoPorAtendimento(startDate, endDate);

    return NextResponse.json({ custoPorAtendimento: custo.toFixed(2) });
  } catch (error: any) {
    console.error('Erro ao buscar o custo por atendimento:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar o custo por atendimento' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
