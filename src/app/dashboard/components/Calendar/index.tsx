"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid"; // Usa a grade de horário
import ptBrLocale from "@fullcalendar/core/locales/pt-br"; // Português-BR
import { api } from '@/lib/api'; // A API importada

export interface CustomerProps {
  id: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  address: string | null;
  phone: string;
  email: string | null;
  responsavel: string | null;
}

export interface ServiceProps {
  id: string;
  name: string;
  description: string | null;
  value: number;
  created_at: Date;
  updated_at: Date;
  duration: string | null;
}

export interface ProfessionalProps {
  id: string;
  name: string;
  specialty: string;
  created_at: Date;
  updated_at: Date;
}

export interface AgendamentoProps {
  id: string;
  date: Date;
  time: string;
  customer: CustomerProps;
  service: ServiceProps | null;
  professional: ProfessionalProps;
  description?: string; // Se existir
  status?: string; // Se existir
  room?: string; // Se existir
}


export default function Calendar() {


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
  return (
    <div className="flex h-[calc(100vh-80px)] px-8">
      {/* Espaço fixo de 64 (16rem) à esquerda */}
      <div className="2xl:w-64"></div>

      {/* Calendário ocupando o restante do espaço sem estourar */}
      <div className="flex-1 max-w-[calc(100vw-16rem)] mx-auto text-center">
        <FullCalendar
          plugins={[timeGridPlugin]} // Usa exibição de horário
          initialView="timeGridWeek" // Exibe a semana com horários
          slotDuration="00:10:00" // Intervalos de 10 minutos
          slotMinTime="08:00:00" // Agora começa às 08:00
          slotMaxTime="18:00:00" // Agora termina às 18:00
          height="85vh" // Ajusta altura do calendário
          locale={ptBrLocale} // Define idioma PT-BR
          nowIndicator={true} // Mostra uma linha no horário atual
          allDaySlot={false} // Remove eventos de "dia inteiro"
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }} // Exibe os horários como "08:00", "09:00", etc. // Passa os agendamentos como eventos
          eventClick={handleEventClick} // Define o callback para o clique
          headerToolbar={{
            start: "prev,next today", // Botões à esquerda
            center: "title", // Data centralizada
            end: "timeGridDay,timeGridWeek", // Opções à direita
          }}
        />
      </div>
    </div>
  );
}
