// app/api/indicadores/valor-repassado-profissionais/route.ts
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

async function calcularValorTotalRepassado(startDate: Date, endDate: Date, professionalId?: string) {
  const { dataInicio, dataFim } = normalizarDatas(startDate, endDate);

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: dataInicio,
          lte: dataFim,
        },
        ...(professionalId && { professionalId }), // Filtrar por profissional se o ID for fornecido
      },
      select: {
        value: true,
      },
    });

    const valorTotalRepassado = appointments.reduce((sum, appointment) => {
      const valorRepassado = parseFloat(appointment.value.toString()) * 0.80;
      return sum + valorRepassado;
    }, 0);

    return valorTotalRepassado;
  } catch (error) {
    console.error("Erro ao calcular o valor total repassado aos profissionais:", error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDateString = searchParams.get('startDate');
  const endDateString = searchParams.get('endDate');
  const professionalId = searchParams.get('professionalId'); // Opcional

  if (!startDateString || !endDateString) {
    return NextResponse.json({ message: 'As datas de início (startDate) e fim (endDate) são obrigatórias na query.' }, { status: 400 });
  }

  try {
    const startDate = new Date(startDateString as string);
    const endDate = new Date(endDateString as string);

    const valorTotal = await calcularValorTotalRepassado(startDate, endDate, professionalId);

    return NextResponse.json({ valorTotalRepassadoProfissionais: valorTotal.toFixed(2) });
  } catch (error: any) {
    console.error('Erro ao buscar o valor total repassado aos profissionais:', error);
    return NextResponse.json({ error: error.message || 'Erro ao buscar o valor total repassado aos profissionais' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}