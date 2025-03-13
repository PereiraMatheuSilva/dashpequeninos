import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import moment from 'moment';

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

    const horarios: { [key: string]: number } = {};
    appointments.forEach((appointment) => {
      const hora = moment(appointment.startTime).format('HH:00');
      if (!horarios[hora]) {
        horarios[hora] = 0;
      }
      horarios[hora]++;
    });

    let horarioPico = '';
    let maxAtendimentos = 0;

    for (const hora in horarios) {
      if (horarios[hora] > maxAtendimentos) {
        maxAtendimentos = horarios[hora];
        horarioPico = hora;
      }
    }

    return NextResponse.json({ horarioPico, maxAtendimentos }, { status: 200 });
  } catch (error) {
    console.error('Erro ao calcular horário de pico:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}