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

  const formattedAgendamentos = agendamentos.map((agendamento) => ({
    ...agendamento,
    date: agendamento.date.toISOString(),
  }));

  console.log(agendamentos)
  console.log(formattedAgendamentos)

  return (
    <div className="w-full xl:mt-2 px-4">
      <div className="w-full flex flex-col lg:flex-row lg:items-center xl:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold lg:ml-20 xl:ml-40">
          Agendamentos
        </h1>

        <div className="mt-4 lg:mt-0 lg:ml-auto">
          <Sheet>
            <SheetTrigger className="bg-yellow-400 px-4 py-2 rounded text-black">
              Novo Agendamento
            </SheetTrigger>
            <SheetContent className="w-full">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold">
                  Novo Agendamento
                </SheetTitle>
                <SheetDescription>
                  Preencha as informações para adicionar um novo agendamento.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <NewAppointmentForm />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Calendário Responsivo */}
      <div className="w-full max-w-6xl mx-auto">
        <Calendar agendamentos={formattedAgendamentos as any} />
      </div>
    </div>
  );
}
