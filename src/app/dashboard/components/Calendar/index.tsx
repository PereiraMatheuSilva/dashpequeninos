"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { Customer, Professional, Services } from "@prisma/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import EditAppointmentForm from "./formCalendarEdit";

// Tipos
export type Appointment = {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  description: string | null;
  value: number;
  status: string;
  room: string | null;
  customerId: string;
  serviceId: string | null;
  professionalId: string;
  created_at: Date | null;
  updated_at: Date | null;
};

export type AppointmentWithRelations = Appointment & {
  customer: Customer;
  professional: Professional;
  service?: Services | null;
};

interface CalendarProps {
  agendamentos: AppointmentWithRelations[];
}

export default function Calendar({ agendamentos }: CalendarProps) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithRelations | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  function handleEventClick(info: { event: { id: string } }) {
    const appointment = agendamentos.find((a) => a.id === info.event.id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsSheetOpen(true);
    }
  }

  const eventos = agendamentos.map((agendamento) => ({
    id: agendamento.id,
    title: `${agendamento.customer.name} - ${
      agendamento.service?.name || "Serviço"
    }`,
    start: agendamento.startTime.toISOString(),
    end: agendamento.endTime.toISOString(),
    description: agendamento.description || "Sem descrição",
    extendedProps: {
      status: agendamento.status,
      professional: agendamento.professional.name,
      room: agendamento.room,
    },
  }));

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] px-2 md:px-8 w-full">
      <div className="hidden 2xl:block 2xl:w-64" />
      <div className="flex-1 w-full max-w-full mx-auto text-center min-w-0 overflow-x-auto">
        <FullCalendar
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          slotDuration="00:10:00"
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          height="auto"
          locale={ptBrLocale}
          nowIndicator
          allDaySlot={false}
          timeZone="UTC"
          events={eventos}
          eventClick={handleEventClick}
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "timeGridDay,timeGridWeek",
          }}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
        />
      </div>

      {/* Sheet para exibir os detalhes do agendamento */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] 2xl:w-[40vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex flex-col mb-2 font-bold text-2xl md:text-3xl">
              Detalhes do Agendamento
            </SheetTitle>
            <SheetDescription>
              Veja as informações do agendamento selecionado.
            </SheetDescription>
          </SheetHeader>
          <EditAppointmentForm agendamento={selectedAppointment} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
