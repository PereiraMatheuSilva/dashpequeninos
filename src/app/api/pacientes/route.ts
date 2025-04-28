// app/api/pacientes/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function normalizarDatas(start: Date, end: Date) {
  const dataInicio = new Date(start);
  dataInicio.setHours(0, 0, 0, 0);

  const dataFim = new Date(end);
  dataFim.setHours(23, 59, 59, 999);

  return { dataInicio, dataFim };
}

async function getNumeroPacientesAtivos(startDate: Date, endDate: Date): Promise<number> {
  const { dataInicio, dataFim } = normalizarDatas(startDate, endDate);

  try {
    const pacientesAtivos = await prisma.customer.findMany({
      where: {
        Appointment: {
          some: {
            date: {
              gte: dataInicio,
              lte: dataFim,
            },
          },
        },
      },
    });
    return pacientesAtivos.length;
  } catch (error) {
    console.error('Erro ao buscar número de pacientes ativos:', error);
    throw error;
  }
}

async function getNumeroNovosPacientes(startDate: Date, endDate: Date): Promise<number> {
  const { dataInicio, dataFim } = normalizarDatas(startDate, endDate);

  try {
    const novosPacientes = await prisma.customer.findMany({
      where: {
        Appointment: {
          some: {
            date: {
              gte: dataInicio,
              lte: dataFim,
            },
          },
        },
      },
      include: {
        Appointment: {
          orderBy: {
            date: 'asc',
          },
          take: 1, // Pegamos apenas o primeiro (mais antigo) agendamento
        },
      },
    });

    const pacientesFiltrados = novosPacientes.filter(cliente =>
      cliente.Appointment.length > 0 && cliente.Appointment[0].date >= dataInicio && cliente.Appointment[0].date <= dataFim
    );

    return pacientesFiltrados.length;
  } catch (error) {
    console.error('Erro ao buscar número de novos pacientes:', error);
    throw error;
  }
}

async function getFrequenciaMediaAtendimentos(startDate: Date, endDate: Date): Promise<number> {
  const { dataInicio, dataFim } = normalizarDatas(startDate, endDate);

  try {
    const totalAtendimentos = await prisma.appointment.count({
      where: {
        date: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
    });

    const numeroPacientesAtivos = await getNumeroPacientesAtivos(startDate, endDate);

    if (numeroPacientesAtivos === 0) {
      return 0; // Evitar divisão por zero
    }

    return totalAtendimentos / numeroPacientesAtivos;
  } catch (error) {
    console.error('Erro ao buscar frequência média de atendimentos:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDateString = searchParams.get('startDate');
  const endDateString = searchParams.get('endDate');

  if (!startDateString || !endDateString) {
    return NextResponse.json({ message: 'As datas de início (startDate) e fim (endDate) são obrigatórias na query.' }, { status: 400 });
  }

  try {
    const startDate = new Date(startDateString as string);
    const endDate = new Date(endDateString as string);

    const numeroPacientesAtivos = await getNumeroPacientesAtivos(startDate, endDate);
    const numeroNovosPacientes = await getNumeroNovosPacientes(startDate, endDate);
    const frequenciaMedia = await getFrequenciaMediaAtendimentos(startDate, endDate);

    return NextResponse.json({
      numeroPacientesAtivos,
      numeroNovosPacientes,
      frequenciaMedia,
    });
  } catch (error: any) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json({ error: error.message || 'Erro ao buscar dados do dashboard' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}