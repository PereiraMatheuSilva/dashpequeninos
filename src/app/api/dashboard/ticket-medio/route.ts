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

    const totalAppointments = appointments.length;
    const receitaTotal = appointments.reduce((total, appointment) => total + appointment.value, 0);
    const ticketMedio = totalAppointments > 0 ? receitaTotal / totalAppointments : 0;

    return NextResponse.json({ ticketMedio }, { status: 200 });
  } catch (error) {
    console.error('Erro ao calcular ticket médio:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}