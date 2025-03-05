'use client'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/input/';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';



const schema = z.object({
  name: z.string().min(1, "O Campo Nome é obrigatório."),
  value: z.string().min(1, "O Valor é obrigatório."),
  descricao: z.string().min(1, "O Campo é obrigatório."),
})

type FormData = z.infer<typeof schema>

export function NewCustosForm(){
  const router = useRouter();

  const { register, handleSubmit, formState: {errors} } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  async function handleRegisterCustos(data: FormData){
    await api.post('/api/custos', {
      name: data.name,
      value: data.value,
      descricao: data.descricao,
    })

    router.refresh();
  }

  return(
    <form className='flex flex-col mb-2 p-4' onSubmit={handleSubmit(handleRegisterCustos)}>
      <div className='flex flex-wrap gap-4'>
        <div className='flex-1 min-w-[250px]'>
          <label className='mb-1 ml-1 text-lg font-medium'>Nome do Custo</label>
          <Input 
            type='text'
            name='name'
            placeholder='Digite o nome Completo'
            error={errors.name?.message}
            register={register}
          />
        </div>

        <div className='flex-1 min-w-[250px]'>
          <label className='mb-1 text-lg font-medium'>Valor R$</label>
          <Input 
            type='text'
            name='value'
            placeholder='Digite o VALOR (R$)'
            error={errors.value?.message}
            register={register}
            />
        </div>

        <div className='flex-1 min-w-[250px]'>
          <label className='mb-1 text-lg font-medium'>Descrição</label>
          <Input 
            type='text'
            name='descricao'
            placeholder='Digite uma Descrição '
            error={errors.descricao?.message}
            register={register}
            />
        </div>
      </div>
      <div className='flex flex-wrap gap-4 mt-3'>

        <div className='flex-1 min-w-[250px]'>
          <Button className='w-full h-[50px] mt-6 bg-green-800 hover:bg-green-700'>Enviar Lançamento</Button>
        </div>
      </div>
    </form>
  )
}
  
