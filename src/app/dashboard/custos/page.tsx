
import { Container } from '@/components/container';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TicketCusto } from '@/app/dashboard/components/ticketCusto';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NewCustosForm } from './form';
import prismaClient from '@/lib/prisma';

export default async function Custos() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const custos = await prismaClient.custos.findMany()

  return (
    <>
      <Container>
        <div className='w-full flex-col items-center justify-between gap-4'>

          <div className='w-full flex items-center justify-between mb-20'>
            <h1 className='text-3xl font-bold'>Custos</h1>
    
            {/* Transformei em SheetTrigger para abrir o modal */}
            <Sheet>
              <SheetTrigger className='bg-yellow-400 px-4 py-1 rounded text-black'>
                Adicionar Custos
              </SheetTrigger>
              <SheetContent side="bottom" className="w-full h-[50vh]">
                <SheetHeader>
                  <SheetTitle>Adicionar Custos</SheetTitle>
                  <SheetDescription>
                    Preencha as informações para adicionar um novo Custos.
                  </SheetDescription>
                </SheetHeader>
                <NewCustosForm />
              </SheetContent>
            </Sheet>
          </div>

          {/* Table posicionada logo abaixo do botão */}
          <table className='min-w-full my-2'>
            <thead>
              <tr className=''>
                <th className='font-medium text-left'>Data Cadastro</th>
                <th className='font-medium text-left'>Nome do Custo</th>
                <th className='font-medium text-left'>Valor</th>
                <th className='font-medium text-left'>Descrição</th>
                <th className='font-medium text-left'>Deletar</th>
              </tr>
            </thead>
            <tbody>

              {custos.map( custo => (   
                <TicketCusto 
                  key={custo.id}
                  custos={custo}
                />
              ))}

            </tbody>
          </table>
        </div>
      </Container>
    </>
  );
}
