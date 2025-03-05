import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prismaClient from '@/lib/prisma';

// Função para obter os dados do cliente, profissionais e serviços
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const customers = await prismaClient.customer.findMany();
    const professionals = await prismaClient.professional.findMany();
    const services = await prismaClient.services.findMany();

    const responseData = {
      customers,
      professionals,
      services
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 400 });
  }
}

// Função para criar um novo agendamento
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    // Recebendo os dados do agendamento a partir do corpo da requisição
    const {
      date,
      startTime,
      endTime,
      description,
      value,
      status,
      room,
      customerId,
      serviceId,
      professionalId
    } = await request.json();

    // Convertendo as horas de início e fim para DateTime
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    // Criando um novo agendamento no banco de dados
    const appointment = await prismaClient.appointment.create({
      data: {
        date: startDateTime, // Data da consulta
        startTime: startDateTime, // Hora de início
        endTime: endDateTime, // Hora de término
        description: description || null, // Descrição (opcional)
        value: value, // Valor do serviço
        status: status || 'pendente', // Status do agendamento (padrão 'pendente')
        room: room || null, // Sala (opcional)
        customerId: customerId, // ID do cliente
        serviceId: serviceId || null, // ID do serviço (opcional)
        professionalId: professionalId, // ID do profissional
      }
    });

    return NextResponse.json({ message: "Agendamento criado com sucesso!", appointment }, { status: 201 });

  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const appointmentId = searchParams.get('id');

  if (!appointmentId) {
    return NextResponse.json({ error: 'Failed to delete appointment: ID not provided' }, { status: 400 }); // Status 400 para indicar erro do cliente
  }

  try {
    await prismaClient.appointment.delete({
      where: {
        id: appointmentId as string,
      },
    });

    return NextResponse.json({ message: 'Appointment deleted successfully!' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 }); // Status 500 para erro do servidor
  }
}