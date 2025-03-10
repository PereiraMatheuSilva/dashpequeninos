'use client';

import { useState } from 'react';
import { CustomerProps } from '@/utils/customer.type';
import { FiEdit } from 'react-icons/fi';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'; // Certifique-se de que o caminho esteja correto
import { EditCustomerForm } from '@/app/dashboard/components/ticket/editFormTicket/';


export function TicketItem({ customer }: { customer: CustomerProps }) {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<CustomerProps | null>(null);

  async function handleDeleteCustomer() {
    try {
      await api.delete('/api/customer', {
        params: {
          id: customer.id,
        },
      });

      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditCustomer() {
    setCustomerToEdit(customer);
    setIsSheetOpen(true);
  }

  return (
    <>
      <tr className="border-b border-slate-200 h-16 last:border-b-0 bg-slate-100 hover:bg-gray-200 duration-300 text-base xl:text-base">
        <td className="px-4 py-2 text-left">
          {customer.created_at
            ? customer.created_at.toLocaleDateString('pt-BR')
            : 'Sem data'}
        </td>
        <td className="px-4 py-2 text-left">{customer.name}</td>
        <td className="px-4 py-2 text-left">{customer.phone}</td>
        <td className="px-4 py-2 text-left">{customer.email}</td>
        <td className="px-4 py-2 text-left max-w-[200px] truncate">
          {customer.address}
        </td>
        <td className="px-4 py-2 text-left">{customer.responsavel}</td>
        <td className="px-4 py-2 text-center">
          <button className="mr-2" onClick={handleEditCustomer}>
            <FiEdit size={20} color="#18325f" />
          </button>
        </td>
      </tr>

      {/* Sheet para edição */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full">
          <SheetHeader>
            <SheetTitle className="flex flex-col mb-2 font-bold text-3xl">Editar Cliente</SheetTitle>
            <SheetDescription className="mb-2">
              Preencha as informações para editar o cliente.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col mt-9 mb-2">
            <EditCustomerForm customerToEdit={customerToEdit} onClose={() => setIsSheetOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}