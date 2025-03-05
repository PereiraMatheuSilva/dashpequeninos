export interface Appointment {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  value: number;
  status: 'confirmado' | 'pendente';
  room?: string;
  customerId: string;
  serviceId?: string;
  professionalId: string;
}

export interface Service {
  id: string;
  name: string;
  value: number;
}

export interface Professional {
  id: string;
  name: string;
}

export interface EditAppointmentFormProps {
  appointment?: Appointment;
  services?: Service[];
  professionals?: Professional[];
}