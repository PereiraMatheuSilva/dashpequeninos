import { NextResponse } from 'next/server';
import prismaClient from '@/lib/prisma';

// Função auxiliar para verificar se uma data é um dia útil (segunda a sexta)
function isDiaUtil(date: Date): boolean {
  const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  return dayOfWeek >= 1 && dayOfWeek <= 6;
}

export async function GET(request: Request) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  try {
    const atendimentos = await prismaClient.appointment.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfToday,
        },
      },
      include: {
        service: true,
      },
    });

    let totalAtendimentos = 0;
    let totalReceita = 0;
    const porDia: Record<string, number> = {};

    atendimentos.forEach((atendimento) => {
      totalAtendimentos++;

      if (atendimento.service?.value) {
        const valorNumerico = parseFloat(atendimento.service.value);
        if (!isNaN(valorNumerico)) {
          totalReceita += valorNumerico;
        } else {
          console.error(`Valor inválido encontrado para receita: ${atendimento.service.value}`);
        }
      }

      const dia = new Date(atendimento.date).toISOString().split('T')[0];
      porDia[dia] = (porDia[dia] || 0) + 1;
    });

    // Contagem de dias úteis únicos no mês (até hoje)
    let diasUteisNoMes = 0;
    const currentDate = new Date(startOfMonth);
    while (currentDate <= endOfToday) {
      if (isDiaUtil(currentDate)) {
        diasUteisNoMes++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return NextResponse.json({
      atendimentosPorDia: porDia,
      totalAtendimentos,
      totalReceita,
      diasUteis: diasUteisNoMes,
    });

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}