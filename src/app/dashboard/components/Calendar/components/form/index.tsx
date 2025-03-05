'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/input/';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { FiLoader } from 'react-icons/fi';
import { Appointment, Service, Professional, EditAppointmentFormProps } from '@/utils/interfaces.types'; // Importe as interfaces

const schema = z.object({
  date: z.string().min(1, 'A data é obrigatória.'),
  startTime: z.string().min(1, 'O horário de início é obrigatório.'),
  endTime: z.string().min(1, 'O horário de término é obrigatório.'),
  description: z.string().optional(),
  value: z.coerce.number().min(0, 'O valor deve ser positivo.'),
  status: z.enum(['confirmado', 'pendente'], { message: 'Selecione um status válido.' }),
  room: z.string().optional(),
  customerId: z.string().min(1, 'O cliente é obrigatório.'),
  serviceId: z.string().optional(),
  professionalId: z.string().min(1, 'O profissional é obrigatório.'),
});

export default function EditAppointmentForm({ appointment, services, professionals }: EditAppointmentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Appointment>({
    resolver: zodResolver(schema),
    defaultValues: appointment || {},
  });

  useEffect(() => {
    if (appointment) {
      Object.keys(appointment).forEach((key) => {
        setValue(key, appointment[key]);
      });
    }
  }, [appointment, setValue]);

  const onSubmit = async (data: Appointment) => {
    setIsLoading(true);
    try {
      if (appointment?.id) {
        await api.put(`/api/appointments/${appointment.id}`, data);
      } else {
        await api.post('/api/dashboard', data);
      }
      router.refresh();
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col mb-2 p-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap gap-4">
        <select {...register('status')} className="w-full p-2 border rounded-md">
          <option value="">Selecione um status</option>
          <option value="confirmado">Confirmado</option>
          <option value="pendente">Pendente</option>
        </select>

        <select {...register('room')} className="w-full p-2 border rounded-md">
          <option value="">Selecione uma sala</option>
          <option value="sala 1">Sala 1</option>
          <option value="sala 2">Sala 2</option>
          <option value="sala 3">Sala 3</option>
        </select>

        <Input type="date" name="date" placeholder="Data" error={errors.date?.message} register={register} />
        <div className="flex w-full gap-4">
          <Input type="time" name="startTime" placeholder="Hora de Início" error={errors.startTime?.message} register={register} />
          <Input type="time" name="endTime" placeholder="Hora de Término" error={errors.endTime?.message} register={register} />
        </div>

        <select {...register('serviceId')} className="w-full p-2 border rounded-md">
          <option value="">Selecione um serviço</option>
          {services?.map((service: Service) => (
            <option key={service.id} value={service.id}>
              {service.name} - R$ {Number(service.value).toFixed(2)}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-4 mt-3">
          <Input type="text" name="description" placeholder="Descrição" error={errors.description?. message} register={register} />
          <Input type="number" name="value" placeholder="Valor" error={errors.value?.message}   register={register} disabled={true} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-3">
        <Input type="text" name="description" placeholder="Descrição" error={errors.description?.message} register={register} />
        <Input type="customerId" name="customerId" placeholder="Valor" error={errors.value?.message} register={register} disabled={true} />
      </div>

      <Button
        type="submit"
        className="w-full h-[50px] mt-6 bg-green-800 hover:bg-green-700 flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <FiLoader className="animate-spin text-white" size={20} />
            Processando...
          </>
        ) : appointment?.id ? (
          'Atualizar Agendamento'
        ) : (
          'Agendar Horário'
        )}
      </Button>
    </form>
  );
}