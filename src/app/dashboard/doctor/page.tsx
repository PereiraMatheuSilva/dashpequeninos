import { Container } from '@/components/container';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TicketDoctor } from '@/app/dashboard/components/ticketDoctor';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NewDoctor } from './components/form';
import PrismaClient from '@/lib/prisma';


export default async function Doctor() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const doctors = await PrismaClient.professional.findMany();

  return (
    <>
      <Container>
        <div className='w-full flex-col items-center justify-between gap-4'>

          <div className='w-full flex items-center justify-between mb-20'>
            <h1 className='text-3xl font-bold'>Profissional</h1>
    
            {/* Transformei em SheetTrigger para abrir o modal */}
            <Sheet>
              <SheetTrigger className='bg-yellow-400 px-4 py-1 rounded text-black'>
                Cadastrar
              </SheetTrigger>
              <SheetContent side="bottom" className="w-full h-[50vh]">
                <SheetHeader>
                  <SheetTitle>Cadastrar Profissional</SheetTitle>
                  <SheetDescription>
                    Preencha as informações para adicionar um novo Profissional.
                  </SheetDescription>
                </SheetHeader>
                <NewDoctor />
              </SheetContent>
            </Sheet>
          </div>

          {/* Table posicionada logo abaixo do botão */}
          <table className='min-w-full my-2'>
            <thead>
              <tr className=''>
                <th className='font-medium text-left'>Data Cadastro</th>
                <th className='font-medium text-left'>Nome do Profissional</th>
                <th className='font-medium text-left'>Telefone</th>
                <th className='font-medium text-left'>Email</th>
                <th className='font-medium text-left'>Especialidade</th>
                <th className='font-medium text-left'>Deletar</th>
              </tr>
            </thead>
            <tbody>
            {doctors.map((doctor)=>(
              <TicketDoctor 
                key={doctor.id}
                doctor={doctor}
              />

            ))}

            </tbody>
          </table>
        </div>
      </Container>
    </>
  );
}
