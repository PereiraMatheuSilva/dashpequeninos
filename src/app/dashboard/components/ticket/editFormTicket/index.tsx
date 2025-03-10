'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/input/';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { CustomerProps } from '@/utils/customer.type';

const schema = z.object({
  name: z.string().min(1, "O Campo Nome é obrigatório."),
  phone: z.string().refine((value) => {
    return /^(?:\(\d{2}\)\s?)?\d{9}$/.test(value) || /^\d{2}\s\d{9}$/.test(value) || /^\d{11}$/.test(value);
  }, {
    message: "O numero de telefone deve estar (DD) 9XXXX-XXXX"
  }),
  email: z.string().email("Digite um E-mail valido").min(1, "O E-mail é obrigatório."),
  address: z.string(),
  responsavel: z.string(),
});

type FormData = z.infer<typeof schema>;

interface EditCustomerFormProps {
  customerToEdit: CustomerProps | null;
  onClose: () => void;
}

export function EditCustomerForm({ customerToEdit, onClose }: EditCustomerFormProps) {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: customerToEdit
      ? {
          name: customerToEdit.name ?? "",
          phone: customerToEdit.phone ?? "",
          email: customerToEdit.email ?? "",
          address: customerToEdit.address ?? "",
          responsavel: customerToEdit.responsavel ?? "",
        }
      : undefined,
  });

  useEffect(() => {
    if (customerToEdit) {
      reset({
        name: customerToEdit.name ?? "",
        phone: customerToEdit.phone ?? "",
        email: customerToEdit.email ?? "",
        address: customerToEdit.address ?? "",
        responsavel: customerToEdit.responsavel ?? "",
      });
    }
  }, [customerToEdit, reset]);

  async function handleRegisterCustomer(data: FormData) {
    if (!customerToEdit) return;

    try {
      await api.put(`/api/customer?id=${customerToEdit.id}`, data);
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteCustomer() {
    if (!customerToEdit) return;

    try {
      await api.delete(`/api/customer?id=${customerToEdit.id}`);
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form className='flex flex-col mb-2 p-4' onSubmit={handleSubmit(handleRegisterCustomer)}>
      <div className='flex flex-wrap gap-4'>
        <div className='flex-1 min-w-[250px]'>
          <label className='mb-1 ml-1 text-lg font-medium'>Nome</label>
          <Input type='text' placeholder='Digite o nome Completo' error={errors.name?.message} register={register} />
        </div>
        <div className='flex-1 min-w-[250px]'>
          <label className='mb-1 text-lg font-medium'>Telefone</label>
          <Input type='text' placeholder='Digite o Telefone (DD) 9XXXX-XXXX' error={errors.phone?.message} register={register} />
        </div>
        <div className='flex-1 min-w-[250px]'>
          <label className='mb-1 text-lg font-medium'>E-mail</label>
          <Input type='email' placeholder='Digite o E-mail' error={errors.email?.message} register={register} />
        </div>
      </div>
      <div className='flex flex-wrap gap-4 mt-3'>
        <div className='flex-1 min-w-[250px]'>
          <label className='mb-1 text-lg font-medium'>Endereço</label>
          <Input type='text' placeholder='Digite o Endereço' error={errors.address?.message} register={register} />
        </div>
        <div className='flex-1 min-w-[250px]'>
          <label className='mb-1 text-lg font-medium'>Responsável</label>
          <Input type='text' placeholder='Digite o nome do Responsável' error={errors.responsavel?.message} register={register}/>
        </div>
      </div>
      <div className='flex flex-row gap-4 mt-6'>
        <Button type='submit' className='w-1/2 h-[50px] bg-yellow-400 hover:bg-yellow-700 text-black'>Salvar</Button>
        <Button type='button' className='w-1/2 h-[50px] bg-red-400 hover:bg-red-700 text-white' onClick={handleDeleteCustomer}>Excluir Cliente</Button>
      </div>
    </form>
  );
}
