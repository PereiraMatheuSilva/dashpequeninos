import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Customer, Professional, Services } from "@prisma/client";
import { FiLoader } from "react-icons/fi";
import { Input } from "@/components/input/";
import { api } from '@/lib/api';

type Appointment = {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  description: string | null;
  value: number;
  status: string;
  room: string | null;
  customerId: string;
  serviceId: string | null;
  professionalId: string;
  created_at: Date | null;
  updated_at: Date | null;
};

type AppointmentWithRelations = Appointment & {
  customer: Customer;
  professional: Professional;
  service?: Services | null;
};

interface EditAppointmentFormProps {
  agendamento: AppointmentWithRelations | null;
  services?: Services[];
  professionals?: Professional[];
  customers?: Customer[];
}

export default function EditAppointmentForm({
  agendamento,
  services = [],
  professionals = [],
  customers = [],
}: EditAppointmentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (agendamento) {
      setValue("date", agendamento.date.toISOString().split("T")[0]);
      setValue(
        "startTime",
        new Date(agendamento.startTime).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setValue(
        "endTime",
        new Date(agendamento.endTime).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setValue("description", agendamento.description || "");
      setValue("value", agendamento.value);
      setValue("status", agendamento.status);
      setValue("room", agendamento.room || "");
      setValue("customerId", agendamento.customerId);
      setValue("serviceId", agendamento.serviceId || "");
      setValue("professionalId", agendamento.professionalId);
    }
  }, [agendamento, setValue]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    console.log("Dados editados:", data);
    setTimeout(() => setIsLoading(false), 2000); // Simulação de envio
  };



  const handleDeleteAppointment = async () => {
    if (!agendamento) return;

    const confirmed = window.confirm(
      "Você tem certeza que deseja excluir o agendamento?"
    );

    if (confirmed) {
      setIsLoading(true);
      try {
        const response = await api.delete(`/api/dashboard?id=${agendamento.id}`);

        if (response.status === 200) {
          alert("Agendamento excluído com sucesso.");
          // Adicione aqui qualquer lógica adicional após a exclusão (por exemplo, fechar o modal)
        } else if (response.status === 401) {
          alert("Não autorizado a excluir o agendamento.");
        } else if (response.status === 400) {
          alert("ID do agendamento não fornecido.");
        } else {
          alert("Erro ao excluir o agendamento.");
        }
      } catch (error) {
        console.error("Erro ao excluir agendamento:", error);
        alert("Erro ao excluir agendamento.");
      } finally {
        setIsLoading(false);
      }
    }
  };


  
  return (
    <form
      className="w-full max-w-5xl mx-auto p-6 space-y-1.5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid xl:grid-cols-2 gap-6">
        <select {...register("status")} className="w-full p-2 border rounded-md" disabled>
          <option value="pendente">Pendente</option>
          <option value="confirmado">Confirmado</option>
        </select>
      </div>

      <Input type="text" name="room" placeholder="Sala" register={register} disabled />
      <Input type="date" name="date" placeholder="Data" register={register} disabled />

      <div className="grid xl:grid-cols-2 gap-6">
        <Input
          type="time"
          name="startTime"
          placeholder="Hora de Início"
          register={register}
          disabled
        />
        <Input
          type="time"
          name="endTime"
          placeholder="Hora de Término"
          register={register}
          disabled
        />
      </div>

      <input
        type="text"
        {...register("customerId")}
        className="w-full p-2 border rounded-md"
        disabled
        value={professionals?.map((professional) => professional.name).join(', ')}
      />

      <input
        type="text"
        {...register("serviceId")}
        className="w-full p-2 border rounded-md"
        disabled
        value={professionals?.map((professional) => professional.name).join(', ')}
      />
      
      <input
        type="text"
        {...register("professionalId")}
        className="w-full p-2 border rounded-md"
        disabled
        value={professionals?.map((professional) => professional.name).join(', ')}
      />



      <div className="flex flex-row gap-4 mt-6">
        <Button type="submit" className="w-1/2 h-[50px] bg-yellow-400 hover:bg-yellow-700 text-black">Confirmar Agendamento</Button>

        <Button type="button" className="w-1/2 h-[50px] bg-red-400 hover:bg-red-700 
        text-white" onClick={handleDeleteAppointment}>  
          Excluir Agendamento
        </Button>
      </div>
    </form>
  );
}