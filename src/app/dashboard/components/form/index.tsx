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
  phone: z.string().refine( (value)=>{
    return /^(?:\(\d{2}\)\s?)?\d{9}$/.test(value) || /^\d{2}\s\d{9}$/.test(value) || /^\d{11}$/.test(value)
  },{
    message: "O numero de telefone deve estar (DD) 9XXXX-XXXX"
  } ),
  email: z.string().email("Digite um E-mail valido").min(1, "O E-mail é obrigatório."), 
  address: z.string(),
  responsavel: z.string(),
})

type FormData = z.infer<typeof schema>

export function NewCustomerForm(){
  const router = useRouter();

  const { register, handleSubmit, formState: {errors} } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  async function handleRegisterCustomer(data: FormData){
    await api.post('/api/customer', {
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      responsavel: data.responsavel
    })

    router.refresh();
  }

  return(
    <form className='flex flex-col mb-2 p-4' onSubmit={handleSubmit(handleRegisterCustomer)}>
      <div className='flex flex-wrap gap-4'>
        <div className='flex-1 min-w-[250px]'>
          <label className='mb-1 ml-1 text-lg font-medium'>Nome</label>
          <Input 
            type='text'
            name='name'
            placeholder='Digite o nome Completo'
            error={errors.name?.message}
            register={register}
          />
        </div>

        <div className='flex-1 min-w-[250px]'>
          <label className='mb-1 text-lg font-medium'>Telefone</label>
          <Input 
            type='number'
            name='phone'
            placeholder='Digite o Telefone (DD) 9XXXX-XXXX'
            error={errors.phone?.message}
            register={register}
            />
        </div>

        <div className='flex-1 min-w-[250px]'>
          <label className='mb-1 text-lg font-medium'>E-mail</label>
          <Input 
            type='email'
            name='email'
            placeholder='Digite o E-mail'
            error={errors.email?.message}
            register={register}
            />
        </div>
      </div>
      <div className='flex flex-wrap gap-4 mt-3'>

  
        <div className='flex-1 min-w-[250px]'>
          <label className='mb-1 text-lg font-medium'>Endereço</label>
          <Input 
            type='text'
            name='address'
            placeholder='Digite o Endereço'
            error={errors.address?.message}
            register={register}
          />
        </div>

        <div className='flex-1 min-w-[250px]'>
          <label className='mb-1 text-lg font-medium'>Responsável</label>
          <Input 
            type='text'
            name='responsavel'
            placeholder='Digite o nome do Responsável'
            error={errors.responsavel?.message}
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
  
