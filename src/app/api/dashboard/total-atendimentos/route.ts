import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para contar dias úteis (exceto domingos)
function contarDiasUteis(inicio: Date, fim: Date): number {
  let count = 0;
  const data = new Date(inicio);

  while (data <= fim) {
    const diaSemana = data.getDay();
    if (diaSemana !== 0) { // 0 = domingo
      count++;
    }
    data.setDate(data.getDate() + 1);
  }

  return count;
}

function normalizarDatas(start: Date, end: Date){
  const dataInicio = new Date(start);
  dataInicio.setHours(0, 0, 0, 0);

  const dataFim = new Date(end);
  dataFim.setHours(23, 59, 59, 999);

  return {dataInicio, dataFim}
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDateStr = searchParams.get('startDate');
  const endDateStr = searchParams.get('endDate');

  if (!startDateStr || !endDateStr) {
    return NextResponse.json({ error: 'Datas inválidas' }, { status: 400 });
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  try {

    const { dataInicio, dataFim } = normalizarDatas(new Date(startDateStr), new Date(endDateStr));

    const TotalAtendimentos = await prisma.appointment.findMany({
      where: {
        date: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
    });

    const AtendimentoTotal = TotalAtendimentos.length;


    const diasUteis = contarDiasUteis(startDate, endDate);
    return NextResponse.json({ AtendimentoTotal, diasUteis }, { status: 200 });

  } catch (error) {
    console.error('Erro ao buscar total de atendimentos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
