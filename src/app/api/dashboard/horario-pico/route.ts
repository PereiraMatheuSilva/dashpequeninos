import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import moment from 'moment';

const prisma = new PrismaClient();
const timeDifferenceHours = 3; // Diferença de 3 horas

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
      // Adiciona 3 horas ao startTime antes de formatar
      const horaLocal = moment(appointment.startTime).add(timeDifferenceHours, 'hours').format('HH:00');
      if (!horarios[horaLocal]) {
        horarios[horaLocal] = 0;
      }
      horarios[horaLocal]++;
    });

    let horarioPico = '';
    let maxAtendimentos = 0;

    for (const hora in horarios) {
      if (horarios[hora] > maxAtendimentos) {
        maxAtendimentos = horarios[hora];
        horarioPico = hora;
      }
    }

    return NextResponse.json({ horarioPico, maxAtendimentos, appointments}, { status: 200 });
  } catch (error) {
    console.error('Erro ao calcular horário de pico:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}