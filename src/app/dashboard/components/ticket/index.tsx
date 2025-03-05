'use client'

import { CustomerProps } from '@/utils/customer.type';
import { FiTrash2 } from 'react-icons/fi'
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';



export function TicketItem({ customer }: { customer:  CustomerProps}){
  const router = useRouter();

  async function handleDeleteCustomer() {
    try {
      const response = await api.delete("/api/customer",{
        params: {
          id: customer.id
        }
      })

      router.refresh();
      
    } catch (error) {
      console.log(error)
    }


  }

  return(
    <>
      <tr className='border-b-2 border-b-slate-200 h-16 last:border-b-0
      bg-slate-100 hover:bg-gray-200 duration-300' >
        <td className="text-left pl-1">
          {customer.created_at ? customer.created_at.toLocaleDateString("pt-BR") : "Sem data"}
        </td>

        <td className="text-left">
          {customer.name}
        </td>

        <td className="text-left">
          {customer.phone}
        </td>

        <td className="text-left">
          {customer.email}
        </td>

        <td className="text-left">
          {customer.address}
        </td>

        <td className="text-left">
          {customer.responsavel}
        </td>

        <td className="text-center">

          <button className='mr-2' onClick={handleDeleteCustomer}>
            <FiTrash2 size={24} color='#EF4444' />
          </button>

        </td>
      </tr>
    </>
  )
}