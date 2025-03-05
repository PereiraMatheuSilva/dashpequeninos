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
  tempo: z.string().min(1, "O Tempo é obrigatório."),
  description: z.string().min(1, "O Campo Descrição é obrigatório."),
})

type FormData = z.infer<typeof schema>

export function NewServices(){
  const router = useRouter();

  const { register, handleSubmit, formState: {errors} } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  async function handleRegisterServices(data: FormData){
    await api.post('/api/services', {
      name: data.name,
      value: data.value,
      tempo: data.tempo,
      description: data.description,
    })

    router.refresh();

  }

  return(
    <form className='flex flex-col mb-2 p-4' onSubmit={handleSubmit(handleRegisterServices)}>
      <div className='flex flex-wrap gap-4'>
        <div className='flex-1 min-w-[250px]'>
          <label className='mb-1 ml-1 text-lg font-medium'>Nome do Serviço</label>
          <Input 
            type='text'
            name='name'
            placeholder='Digite o nome do serviço'
            error={errors.name?.message}
            register={register}
          />
        </div>

        <div className='flex-1 min-w-[250px]'>
          <label className='mb-1 text-lg font-medium'>Valor R$</label>
          <Input 
            type='text'
            name='value'
            placeholder='Digite o valor do serviço'
            error={errors.value?.message}
            register={register}
            />
        </div>

        <div className='flex-1 min-w-[250px]'>
          <label className='mb-1 text-lg font-medium'>Tempo de serviço</label>
          <Input 
            type='text'
            name='tempo'
            placeholder='Digite o tempo em minutos'
            error={errors.tempo?.message}
            register={register}
            />
        </div>
      </div>
      <div className='flex flex-wrap gap-4 mt-3'>

      <div className='flex-1 min-w-[250px]'>
        <label className='mb-1 text-lg font-medium'>Descrição</label>
        <Input 
          type='text'
          name='description'
          placeholder='Digite uma descrição para o serivço'
          error={errors.description?.message}
          register={register}
          />
        </div>

        <div className='flex-1 min-w-[250px]'>
          <Button className='w-full h-[50px] mt-6 bg-green-800 hover:bg-green-700'>Enviar Dados</Button>
        </div>
      </div>
    </form>
  )
}
  
