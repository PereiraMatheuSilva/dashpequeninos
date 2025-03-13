"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid"; 
import ptBrLocale from "@fullcalendar/core/locales/pt-br"; 
import { api } from '@/lib/api';
import { Customer, Professional, Services } from '@prisma/client';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import EditAppointmentForm from './formCalendarEdit';

type Appointment = {
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
}

type AppointmentWithRelations = Appointment & {
  customer: Customer;
  professional: Professional;
  service?: Services | null;
};

interface CalendarProps {
  agendamentos: AppointmentWithRelations[];
}

export default function Calendar({ agendamentos }: CalendarProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithRelations | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleEventClick = async (info: any) => {
    const id = info.event.id; 
    const appointment = agendamentos.find((a) => a.id === id);
    
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsSheetOpen(true); // Abre o Sheet
    }
  };


  const eventos = agendamentos.map((agendamento) => ({
    id: agendamento.id,
    title: `${agendamento.customer.name} - ${agendamento.service?.name || "Serviço"}`,
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
          timeZone="UTC" 
          events={eventos}
          eventClick={handleEventClick}
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "timeGridDay,timeGridWeek",
          }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }}
        />
      </div>

      {/* Sheet para exibir os detalhes do agendamento */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full">
          <SheetHeader>
            <SheetTitle className='flex flex-col mb-2 font-bold text-3xl'>Detalhes do Agendamento</SheetTitle>
            <SheetDescription>
              Veja as informações do agendamento selecionado.
            </SheetDescription>
          </SheetHeader >

          <EditAppointmentForm agendamento={selectedAppointment}/>
          
        </SheetContent>
      </Sheet>
    </div>
  );
}
