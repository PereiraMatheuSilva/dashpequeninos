import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateString = searchParams.get('startDate');
    const endDateString = searchParams.get('endDate');

    const startDate = startDateString ? new Date(startDateString) : undefined;
    const endDate = endDateString ? new Date(endDateString) : undefined;

    const whereClause = startDate && endDate
      ? {
          date: {
            gte: startDate,
            lte: endDate,
          },
        }
      : {};

    const atendimentosComProfissionais = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        professional: {
          select: {
            description: true,
          },
        },
      },
    });

    const atendimentosPorEspecialidadeMap: { [key: string]: number } = {};

    atendimentosComProfissionais.forEach(atendimento => {
      const especialidade = atendimento.professional?.description?.trim();
      if (especialidade) {
        atendimentosPorEspecialidadeMap[especialidade] =
          (atendimentosPorEspecialidadeMap[especialidade] || 0) + 1;
      }
    });

    const data = Object.entries(atendimentosPorEspecialidadeMap).map(
      ([especialidade, count]) => ({
        especialidade,
        count,
      })
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar atendimentos por especialidade:', error);
    return NextResponse.json({ message: 'Erro ao buscar os dados.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}