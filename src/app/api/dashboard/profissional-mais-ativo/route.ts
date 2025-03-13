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
      include: {
        professional: true,
      },
    });

    const profissionais: { [key: string]: number } = {};
    appointments.forEach((appointment) => {
      if (appointment.professional) {
        const profissionalId = appointment.professionalId;
        if (!profissionais[profissionalId]) {
          profissionais[profissionalId] = 0;
        }
        profissionais[profissionalId]++;
      }
    });

    let profissionalMaisAtivo = null;
    let maxAtendimentos = 0;

    for (const profissionalId in profissionais) {
      if (profissionais[profissionalId] > maxAtendimentos) {
        maxAtendimentos = profissionais[profissionalId];
        profissionalMaisAtivo = await prisma.professional.findUnique({
          where: { id: profissionalId },
        });
      }
    }

    return NextResponse.json({ profissionalMaisAtivo, maxAtendimentos }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar profissional mais ativo:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}