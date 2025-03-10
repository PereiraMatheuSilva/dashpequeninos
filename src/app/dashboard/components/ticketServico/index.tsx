'use client'

import { ServicoProps } from '@/utils/servicos.type';
import { FiTrash2,FiFile } from 'react-icons/fi'
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function TicketServico({servico}: {servico: ServicoProps}){
  const router = useRouter();

  async function handleDeleteServicos() {
    try {
      const response = await api.delete("/api/services",{
        params: {
          id: servico.id
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
      bg-slate-100 hover:bg-gray-200 duration-300 text-base xl:text-base' >
        <td className="text-left pl-1">
          {servico.created_at ? servico.created_at.toLocaleDateString("pt-BR") : "Sem data"}
        </td>

        <td className="text-left">
          {servico.name}
        </td>

        <td className="text-left">
          {servico.value}
        </td>

        <td className="text-left">
          {servico.time} min
        </td>

        <td className="text-left">
          {servico.description}
        </td>

        <td className="text-center">

          <button className='mr-2' onClick={handleDeleteServicos}>
            <FiTrash2 size={24} color='#EF4444' />
          </button>

        </td>
      </tr>
    </>
  )
}
