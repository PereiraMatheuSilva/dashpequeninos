'use client'

import { DoctorProps } from '@/utils/doctor.type';
import { FiTrash2,FiFile } from 'react-icons/fi'
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';


export function TicketDoctor(doctor: {doctor: DoctorProps}){
  const router = useRouter();

  async function handleDeleteDoctor() {
  try {
    const response = await api.delete("/api/doctor",{
      params: {
        id: doctor.doctor.id
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
      bg-slate-100 hover:bg-gray-200 duration-300 text-base xl:text-base'>
        <td className="text-left pl-1">
          {doctor.doctor.created_at ? doctor.doctor.created_at.toLocaleDateString("pt-BR") : "Sem data"}
        </td>

        <td className="text-left">
          {doctor.doctor.name}
        </td>

        <td className="text-left">
          {doctor.doctor.phone}
        </td>

        <td className="text-left">
          {doctor.doctor.email}
        </td>

        <td className="text-left">
          {doctor.doctor.description}
        </td>

        <td className="text-center">

          <button className='mr-2' onClick={handleDeleteDoctor}>
            <FiTrash2 size={24} color='#EF4444' />
          </button>

        </td>
      </tr>
    </>
  )
}
