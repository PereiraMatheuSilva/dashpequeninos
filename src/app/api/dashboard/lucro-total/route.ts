import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
    });

    const custos = await prisma.custos.findMany({
      where: {
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
    });

    const receitaTotal = appointments.reduce((total, appointment) => total + appointment.value, 0);
    const custosTotais = custos.reduce((total, custo) => total + parseFloat(custo.value), 0);
    const lucroTotal = receitaTotal - custosTotais;

    return NextResponse.json({ lucroTotal }, { status: 200 });
  } catch (error) {
    console.error('Erro ao calcular lucro total:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}