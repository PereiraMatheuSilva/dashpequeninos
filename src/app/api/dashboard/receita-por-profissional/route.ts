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

    const receitaPorProfissional: { [key: string]: { nome: string; receita: number } } = {};
    appointments.forEach((appointment) => {
      if (appointment.professional) {
        const profissionalId = appointment.professionalId;
        if (!receitaPorProfissional[profissionalId]) {
          receitaPorProfissional[profissionalId] = {
            nome: appointment.professional.name,
            receita: 0,
          };
        }
        receitaPorProfissional[profissionalId].receita += appointment.value;
      }
    });

    const resultado = Object.values(receitaPorProfissional);

    return NextResponse.json(resultado, { status: 200 });
  } catch (error) {
    console.error('Erro ao calcular receita por profissional:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}