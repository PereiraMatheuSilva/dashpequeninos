import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateString = searchParams.get('startDate');
    const now = new Date();
    const startDate = startDateString ? new Date(startDateString) : undefined;
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const whereClause = startDate && endOfToday
      ? {
          date: {
            gte: startDate,
            lte: endOfToday,
          },
        }
      : {};

    const atendimentosComProfissionais = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        professional: {
          select: {
            name: true, // Ou o campo que você usa para identificar o profissional
          },
        },
      },
    });

    const atendimentosPorProfissionalMap: { [key: string]: number } = {};

    atendimentosComProfissionais.forEach(atendimento => {
      const nomeProfissional = atendimento.professional?.name?.trim(); // Ajuste para o campo correto
      if (nomeProfissional) {
        atendimentosPorProfissionalMap[nomeProfissional] =
          (atendimentosPorProfissionalMap[nomeProfissional] || 0) + 1;
      }
    });

    const data = Object.entries(atendimentosPorProfissionalMap).map(
      ([profissional, count]) => ({
        profissional,
        count,
      })
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar atendimentos por profissional:', error);
    return NextResponse.json({ message: 'Erro ao buscar os dados.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}