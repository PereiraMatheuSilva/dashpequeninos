"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid"; // Usa a grade de horário
import ptBrLocale from "@fullcalendar/core/locales/pt-br"; // Português-BR
import { api } from '@/lib/api'; // A API importada
import { Appointment, Customer, Professional, Services } from '@prisma/client';


type AppointmentWithRelations = Appointment & {
  customer: Customer;
  professional: Professional;
  service?: Services | null;
};

interface CalendarProps {
  agendamentos: AppointmentWithRelations[];
}

export default function Calendar({ agendamentos }: CalendarProps) {

  // Função chamada quando um evento é clicado
  const handleEventClick = async (info: any) => {
  const id = info.event.id; // ID do evento clicado

  const confirmed = window.confirm('Você tem certeza que deseja excluir o agendamento?');

  if (confirmed) {
    try {
      const response = await api.delete(`/api/dashboard?id=${id}`); // Passando o ID como query parameter

      if (response.status === 200) {
        alert('Agendamento excluído com sucesso.');
        info.event.remove();
      } else if (response.status === 401) {
        alert('Não autorizado a excluir o agendamento.');
      } else if (response.status === 400) {
        alert('ID do agendamento não fornecido.');
      } else {
        alert('Erro ao excluir o agendamento.');
      }
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      alert('Erro ao excluir agendamento.');
    }
  }
  };

  // Transformando os agendamentos em eventos do FullCalendar
  const eventos = agendamentos.map((agendamento) => ({
    id: agendamento.id,
    title: `${agendamento.customer.name} - ${agendamento.service?.name || "Serviço"}`,
    start: agendamento.startTime, // Hora de início
    end: agendamento.endTime, // Hora de término
    description: agendamento.description || "Sem descrição",
    extendedProps: {
      status: agendamento.status,
      professional: agendamento.professional.name,
      room: agendamento.room,
    },
  }));

  return (
    <div className="flex h-[calc(100vh-80px)] px-8">
      <div className="2xl:w-64"></div>
      <div className="flex-1 max-w-[calc(100vw-16rem)] mx-auto text-center">
        <FullCalendar
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          slotDuration="00:10:00"
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          height="85vh"
          locale={ptBrLocale}
          nowIndicator={true}
          allDaySlot={false}
          events={eventos}
          eventClick={handleEventClick}
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "timeGridDay,timeGridWeek",
          }}
        />
      </div>
    </div>
  );
}
