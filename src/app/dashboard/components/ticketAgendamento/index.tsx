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
import { toast } from 'react-toastify';

interface Customer {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  value: number;
}

interface Professional {
  id: string;
  name: string;
}

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

type FormData = z.infer<typeof schema>;

export default function NewAppointmentForm() {
  const router = useRouter();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: '',
      startTime: '',
      endTime: '',
      description: '',
      value: 0,
      status: 'pendente',
      room: '',
      customerId: '',
      serviceId: '',
      professionalId: '',
    }
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleGetDashboard() {
    try {
      const response = await api.get('/api/dashboard');
      setProfessionals(response.data.professionals || []);
      setServices(response.data.services || []);
      setCustomers(response.data.customers || []);
      router.refresh();
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      toast.error('Erro ao carregar os dados.');
    }
  }

  useEffect(() => {
    handleGetDashboard();
  }, []);

  const selectedServiceId = watch('serviceId');

  useEffect(() => {
    if (selectedServiceId) {
      const selectedService = services.find(service => service.id === selectedServiceId);
      setValue('value', selectedService ? selectedService.value : 0);
    }
  }, [selectedServiceId, services, setValue]);

  const onSubmit = async (data: FormData) => {
  setIsLoading(true);
  try {
    const response = await api.post('/api/dashboard', data);

    console.log(response)

    if (response.status === 200) {
      alert("Agendamento criado com sucesso!");
      router.refresh();
    } else {
      //console.error(`Erro inesperado: Status ${response.status}`);
      alert("Agendamento criado com sucesso!");
      router.refresh();
    }
  } catch (error: any) {
    console.error('Erro ao enviar os dados:', error);

    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Erro ao processar o agendamento. Verifique os dados e tente novamente.");
    }
  } finally {
    setIsLoading(false);
  }
  };

  return (
    <form className="w-full max-w-5xl mx-auto p-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid xl:grid-cols-2 gap-6">
        <select {...register('status')} className='w-full p-2 border rounded-md'>
          <option value='pendente'>Pendente</option>
          <option value='confirmado'>Confirmado</option>
        </select>

        <select {...register('room')} className="w-full p-2 border rounded-md">
          <option value="">Selecione uma sala</option>
          <option value="sala 1">Sala 1</option>
          <option value="sala 2">Sala 2</option>
          <option value="sala 3">Sala 3</option>
        </select>
      </div>

      <Input type="date" name="date" placeholder="Data" error={errors.date?.message} register={register} />
      
      <div className="grid xl:grid-cols-2 gap-6">
        <Input type="time" name="startTime" placeholder="Hora de Início" error={errors.startTime?.message} register={register} />
        <Input type="time" name="endTime" placeholder="Hora de Término" error={errors.endTime?.message} register={register} />
      </div>

      <select {...register('serviceId')} className="w-full p-2 border rounded-md">
        <option value="">Selecione um serviço</option>
        {services.map(service => (
          <option key={service.id} value={service.id}>{service.name} - R$ {Number(service.value).toFixed(2)}</option>
        ))}
      </select>

      <select {...register('professionalId')} className="w-full p-2 border rounded-md">
        <option value="">Selecione um profissional</option>
        {professionals.map(professional => (
          <option key={professional.id} value={professional.id}>{professional.name}</option>
        ))}
      </select>

      <select {...register('customerId')} className="w-full p-2 border rounded-md">
        <option value="">Selecione um Cliente</option>
        {customers.map(customer => (
          <option key={customer.id} value={customer.id}>{customer.name}</option>
        ))}
      </select>

      <Button type="submit" className="w-full h-[50px] mt-6 bg-green-800 hover:bg-green-700 flex items-center justify-center gap-2" disabled={isLoading}>
        {isLoading ? (<><FiLoader className="animate-spin text-white" size={20} />Processando...</>) : "Agendar Horário"}
      </Button>
    </form>
  );
}
