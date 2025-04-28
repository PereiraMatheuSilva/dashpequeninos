import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


function normalizarDatas(start: Date, end: Date){
  const dataInicio = new Date(start);
  dataInicio.setHours(0, 0, 0, 0);

  const dataFim = new Date(end);
  dataFim.setHours(23, 59, 59, 999)

  return { dataInicio, dataFim }
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if(!startDate || !endDate){
    return NextResponse.json({ error: 'Datas Inválidas' }, {status:400})
  }

  const { dataInicio, dataFim } = normalizarDatas(new Date(startDate), new Date(endDate));


  try {
    
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: dataInicio ? new Date(dataInicio) : undefined,
          lte: dataFim ? new Date(dataFim) : undefined,
        },
      },
    });

    const receitaTotal = appointments.reduce((total, appointment) => total + appointment.value, 0);

    return NextResponse.json({ receitaTotal }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar receita total:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}