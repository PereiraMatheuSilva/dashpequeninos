import { Container } from '@/components/container';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TicketServico } from '@/app/dashboard/components/ticketServico';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NewServices } from './components/form';
import prismaClient from '@/lib/prisma';

export default async function Servicos() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const servicos = await prismaClient.services.findMany();

  return (
    <Container>
      <div className='w-full flex-col items-center justify-between gap-4'>

        <div className='w-full flex items-center justify-between mb-20'>
          <h1 className='text-3xl font-bold'>Serviços</h1>
  
          {/* Transformei em SheetTrigger para abrir o modal */}
          <Sheet>
            <SheetTrigger className='bg-yellow-400 px-4 py-1 rounded text-black'>
              Adicionar Serviço
            </SheetTrigger>
            <SheetContent side="bottom" className="w-full h-[50vh]">
              <SheetHeader>
                <SheetTitle>Adicionar Serviço</SheetTitle>
                <SheetDescription>
                  Preencha as informações para adicionar um novo Serviço.
                </SheetDescription>
              </SheetHeader>
              <NewServices />
            </SheetContent>
          </Sheet>
        </div>

        {/* Table posicionada logo abaixo do botão */}
        <table className='min-w-full my-2'>
          <thead>
            <tr>
              <th className='font-medium text-left'>Data Cadastro</th>
              <th className='font-medium text-left'>Nome do Serviço</th>
              <th className='font-medium text-left'>Valor</th>
              <th className='font-medium text-left'>Tempo de serviço</th>
              <th className='font-medium text-left'>Descrição</th>
              <th className='font-medium text-left'>Deletar</th>
            </tr>
          </thead>
          <tbody>
            {servicos.map((servico)=>(
              <TicketServico 
                key={servico.id}
                servico={servico}
              />
            ))}



          </tbody>
        </table>
      </div>
    </Container>
  );
}
