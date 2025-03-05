import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prismaClient from '@/lib/prisma';
import Calendar from './components/Calendar';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import NewAppointmentForm from '@/app/dashboard/components/ticketAgendamento';
import { Session } from 'next-auth'; // Importe o tipo Session do next-auth

// Defina as interfaces para os dados do Prisma
interface Customer {
  id: string;
  created_at: Date | null;
  updated_at: Date | null;
  name: string;
  address: string | null;
  phone: string;
  email: string | null;
  responsavel: string | null;
}

interface Professional {
  id: string;
  created_at: Date | null;
  updated_at: Date | null;
  name: string;
  // ... outras propriedades do profissional
}

interface Service {
  id: string;
  created_at: Date | null;
  updated_at: Date | null;
  name: string;
  // ... outras propriedades do serviço
}

interface Appointment {
  id: string;
  date: Date;
  customer: Customer;
  professional: Professional;
  service: Service | null;
  // ... outras propriedades do agendamento
}

interface CalendarProps {
  agendamentos: Appointment[];
}

// Defina o tipo para a sessão
type MySession = Session | null;

export default async function Clientes() {
  const session = (await getServerSession(authOptions)) as MySession;

  if (!session || !session.user) {
    redirect('/');
  }

  const agendamentos = (await prismaClient.appointment.findMany({
    include: {
      customer: true,
      professional: true,
      service: true,
    },
  })) as Appointment[];

  console.log(agendamentos);

  // Formate as datas para string, se necessário para o Calendar
  const formattedAgendamentos = agendamentos.map((agendamento) => ({
    ...agendamento,
    date: agendamento.date.toISOString(), // ou toLocaleDateString(), dependendo do Calendar
  }));

  return (
    <div className="w-full">
      <div className="w-full flex items-center mb-20">
        <h1 className="text-3xl font-bold ml-80">Agendamentos</h1>

        <Sheet>
          <SheetTrigger className="bg-yellow-400 px-4 py-1 rounded text-black ml-20">
            Novo Agendamento
          </SheetTrigger>
          <SheetContent className="w-full">
            <SheetHeader>
              <SheetTitle className="flex flex-col mb-2 font-bold text-3xl">
                Novo Agendamento
              </SheetTitle>
              <SheetDescription className="mb-2">
                Preencha as informações para adicionar um novo agendamento.
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col mt-9 mb-2">
              <NewAppointmentForm />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Passando os agendamentos formatados para o Calendar */}
      <Calendar agendamentos={formattedAgendamentos as any} />
    </div>
  );
}