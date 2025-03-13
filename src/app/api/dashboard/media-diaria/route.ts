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

    const dias: { [key: string]: number } = {};
    appointments.forEach((appointment) => {
      const dia = moment(appointment.date).format('YYYY-MM-DD');
      if (!dias[dia]) {
        dias[dia] = 0;
      }
      dias[dia]++;
    });

    const totalDias = Object.keys(dias).length;
    const totalAtendimentos = appointments.length;
    const mediaDiaria = totalDias > 0 ? totalAtendimentos / totalDias : 0;

    return NextResponse.json({ mediaDiaria }, { status: 200 });
  } catch (error) {
    console.error('Erro ao calcular média diaria')
  }
}