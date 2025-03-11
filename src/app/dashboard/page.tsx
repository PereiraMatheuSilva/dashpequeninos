import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prismaClient from '@/lib/prisma';
import Calendar from './components/Calendar';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import NewAppointmentForm from '@/app/dashboard/components/ticketAgendamento';
import { Appointment, Customer, Professional, Services } from '@prisma/client';

type AppointmentWithRelations = Appointment & {
  customer: Customer;
  professional: Professional;
  service?: Services | null; // O serviço pode ser opcional
};


export default async function Clientes() {
  
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const agendamentos: AppointmentWithRelations[] = await prismaClient.  appointment.findMany({
    include: {
      customer: true,
      professional: true,
      service: true,
    },
  });


  console.log(agendamentos);

  return (
    <div className="w-full"> 
      <div className='w-full flex items-center mb-20'>
        <h1 className='text-3xl font-bold ml-80'>Agendamentos</h1>

        <Sheet>
          <SheetTrigger className='bg-yellow-400 px-4 py-1 rounded text-black ml-20'>
            Novo Agendamento
          </SheetTrigger>
          <SheetContent className="w-full">
            <SheetHeader>
              <SheetTitle className='flex flex-col mb-2 font-bold text-3xl'>Novo Agendamento</SheetTitle>
              <SheetDescription>
                Preencha as informações para adicionar um novo agendamento.
              </SheetDescription>
            </SheetHeader >

            <div className='flex flex-col mb-2'>
              <NewAppointmentForm />
            </div>
          </SheetContent>
        </Sheet>     
      </div>

      {/* Passando os agendamentos para o Calendar */}
      <Calendar agendamentos={agendamentos}  />
    </div>    
  );
}