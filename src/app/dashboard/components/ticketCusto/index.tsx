'use client'

import { CustosProps } from '@/utils/custos.type';
import { FiTrash2,FiFile } from 'react-icons/fi';
import { api } from '@/lib/api';


export function TicketCusto({custos}: {custos: CustosProps}){

  async function handleDeleteCusto() {
    try {
      const response = await api.delete("/api/custos",{
        params: {
          id: custos.id
        }
      })

      console.log(response.data);
      
    } catch (error) {
      console.log(error)
    }


  }


  return(
    <>
      <tr className='border-b-2 border-b-slate-200 h-16 last:border-b-0
      bg-slate-100 hover:bg-gray-200 duration-300 text-base xl:text-base' >
        <td className="text-left pl-1">
          {custos.createdAt ? custos.createdAt.toLocaleDateString("pt-BR") : "Sem data"}
        </td>

        <td className="text-left">
          {custos.name}
        </td>

        <td className="text-left">
          R${custos.value}
        </td>

        <td className="text-left">
          {custos.description}
        </td>

        <td className="text-left">

          <button className='mr-2' onClick={handleDeleteCusto}>
            <FiTrash2 size={24} color='#EF4444' />
          </button>

        </td>
      </tr>
    </>
  )
}
