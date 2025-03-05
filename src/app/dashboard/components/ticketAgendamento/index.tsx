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
      status: 'pendente', // Definindo o valor padrão para o status
    }
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Adiciona estado de carregamento

  async function handleGetDashboard() {
    try {
      const response = await api.get('/api/dashboard');

      setProfessionals(response.data.professionals || []);
      setServices(response.data.services || []);
      setCustomers(response.data.customers || []);

      router.refresh();
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    }
  }

  useEffect(() => {
    handleGetDashboard();
  }, []);

  // Captura o ID do serviço selecionado
  const selectedServiceId = watch('serviceId');

  // Atualiza o campo de valor quando o serviço for selecionado
  useEffect(() => {
    if (selectedServiceId) {
      const selectedService = services.find(service => service.id === selectedServiceId);
      if (selectedService) {
        setValue('value', selectedService.value); // Atualiza o valor no form
      }
    } else {
      setValue('value', 0); // Reseta o valor se não houver serviço selecionado
    }
  }, [selectedServiceId, services, setValue]);

  // Valida se o horário de término é posterior ao horário de início
  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const onSubmit = async (data: FormData) => {
  
    setIsLoading(true); // Inicia o estado de carregamento
    
    try {
      // Envia a requisição POST para o backend
      const response = await api.post('/api/dashboard', data);
    
      // Verifica se a resposta foi bem-sucedida
      if (response.status === 200) {
        //console.log('Agendamento realizado com sucesso!', response.data);
        // Redireciona ou mostra uma mensagem de sucesso
        router.refresh();
      } else {
        // Trate aqui a resposta de erro do servidor, se necessário
        router.refresh();
      }
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  // Verificando erros de validação
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      //console.log('Erros de validação:', errors);
    }
  }, [errors]);

  return (
    <form className="flex flex-col mb-2 p-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Formulário de entrada */}


      <div className="flex flex-wrap gap-4">

        <select {...register('status')} className='w-full p-2 border rounded-md'>
          <option value=''>Selecione um status</option>
          <option value='confirmado'>Confirmado</option>
          <option value='pendente'>Pendente</option>
        </select>


        <select {...register('room')} className="w-full p-2 border rounded-md">
          <option value="">Selecione uma sala</option>
          <option value="sala 1">Sala 1</option>
          <option value="sala 2">Sala 2</option>
          <option value="sala 3">Sala 3</option>
        </select>

        <Input
          type="date"
          name="date"
          placeholder="Data"
          error={errors.date?.message}
          register={register}
        />

        <div className="flex w-full gap-4">
          <Input
            type="time"
            name="startTime"
            placeholder="Hora de Início"
            error={errors.startTime?.message}
            register={register}
          />
          <Input
            type="time"
            name="endTime"
            placeholder="Hora de Término"
            error={errors.endTime?.message}
            register={register}
          />
        </div>

        <select {...register('serviceId')} className="w-full p-2 border rounded-md">
          <option value="">Selecione um serviço</option>
          {services.map(service => (
            <option key={service.id} value={service.id}>
              {service.name} - R$ {Number(service.value).toFixed(2)}
            </option>
          ))}
        </select>

        <select {...register('professionalId')} className="w-full p-2 border rounded-md">
          <option value="">Selecione um profissional</option>
          {professionals.map(professional => (
            <option key={professional.id} value={professional.id}>
              {professional.name}
            </option>
          ))}
        </select>

        <select {...register('customerId')} className="w-full p-2 border rounded-md">
          <option value="">Selecione um Cliente</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-4 mt-3">
        <Input
          type="text"
          name="description"
          placeholder="Descrição"
          error={errors.description?.message}
          register={register}
        />

        <Input
          type="number"
          name="value"
          placeholder="Valor"
          error={errors.value?.message}
          register={register}
          disabled={true} // Deixa o campo desabilitado
        />
      </div>

      <Button
        type="submit"
        className="w-full h-[50px] mt-6 bg-green-800 hover:bg-green-700 flex items-center justify-center      gap-2"
        disabled={isLoading} // Desabilita o botão enquanto carrega
      >
        {isLoading ? (
          <>
            <FiLoader className="animate-spin text-white" size={20} />
            Processando...
          </>
        ) : (
          "Agendar Horário"
        )}
      </Button>

    </form>
  );
}
