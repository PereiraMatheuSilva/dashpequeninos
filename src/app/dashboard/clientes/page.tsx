import { Container } from '@/components/container';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TicketItem } from '@/app/dashboard/components/ticket';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NewCustomerForm } from '@/app/dashboard/components/form';
import prismaClient from '@/lib/prisma';

export default async function Clientes() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const customers = await prismaClient.customer.findMany()

  return (
    <>
      <Container>
        <div className='w-full flex-col items-center justify-between gap-4'>
    
          <div className='w-full flex items-center justify-between mb-20'>
            <h1 className='text-3xl font-bold'>Clientes</h1>
    
            {/* Transformei em SheetTrigger para abrir o modal */}
            <Sheet>
              <SheetTrigger className='bg-yellow-400 px-4 py-1 rounded text-black'>
                Cadastrar
              </SheetTrigger>
              <SheetContent side="bottom" className="w-full h-[50vh]">
                <SheetHeader>
                  <SheetTitle className='flex flex-col mb-2 font-bold text-3xl'>Cadastrar novo cliente</SheetTitle>
                  <SheetDescription>
                    Preencha as informações para adicionar um novo cliente.
                  </SheetDescription>
                </SheetHeader >
                
                <div className='flex flex-col mb-2'>
                  <NewCustomerForm />
                </div>


              </SheetContent>
            </Sheet>
          </div>
    
          {/* Tabela de clientes */}
          <table className='min-w-full my-2'>
            <thead>
              <tr className="text-sm xl:text-base">
                <th className='font-medium text-left'>Data Cadastro</th>
                <th className='font-medium text-left'>Cliente</th>
                <th className='font-medium text-left'>Telefone</th>
                <th className='font-medium text-left'>Email</th>
                <th className='font-medium text-left'>Endereço</th>
                <th className='font-medium text-left'>Responsável</th>
                <th className='font-medium text-left'>Editar</th>
              </tr>
            </thead>
            <tbody>
              {customers.map( customer => (
                <TicketItem 
                  key={customer.id}
                  customer={customer}
                />
              ))}
              
            </tbody>
          </table>
        </div>
      </Container>
    </>
  );
}
