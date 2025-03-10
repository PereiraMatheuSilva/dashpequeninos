export interface CustomerProps {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  responsavel: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface ServiceProps {
  id: string;
  name: string;
  description: string | null;
  value: string; // Pode ser `string` se for assim no banco
  created_at: Date | null;
  updated_at: Date | null;
  time: string | null; // Se for `time` no banco
}


export interface ProfessionalProps {
  id: string;
  name: string;
  specialty: string;
}

export interface AgendamentoProps {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  description: string | null;
  value: number;
  status: string;
  room: string | null; // Alterado para permitir `null`
  customer: CustomerProps;
  service: ServiceProps | null;
  professional: ProfessionalProps;
}
