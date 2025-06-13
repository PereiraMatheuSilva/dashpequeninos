import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Customer, Professional, Services } from "@prisma/client";
import { FiLoader } from "react-icons/fi";
import { Input } from "@/components/input/";
import { api } from "@/lib/api";

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

type FormData = {
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  value: number;
  status: string;
  room: string;
  customerId: string;
  serviceId: string;
  professionalId: string;
};

const formatTime = (date: Date): string => {
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 3);
  return adjustedDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

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
  } = useForm<FormData>();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (agendamento) {
      setValue("date", formatDate(agendamento.date));
      setValue("startTime", formatTime(agendamento.startTime));
      setValue("endTime", formatTime(agendamento.endTime));
      setValue("description", agendamento.description || "");
      setValue("value", agendamento.value);
      setValue("status", agendamento.status);
      setValue("room", agendamento.room || "");
      setValue("customerId", agendamento.customerId);
      setValue("serviceId", agendamento.serviceId || "");
      setValue("professionalId", agendamento.professionalId);
    }
  }, [agendamento, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const [startHour, startMinute] = data.startTime.split(":").map(Number);
      const [endHour, endMinute] = data.endTime.split(":").map(Number);
      const [year, month, day] = data.date.split("-").map(Number);

      const startDateUTC = new Date(
        Date.UTC(year, month - 1, day, startHour, startMinute)
      );
      const endDateUTC = new Date(
        Date.UTC(year, month - 1, day, endHour, endMinute)
      );

      const appointmentData = {
        ...data,
        startTime: startDateUTC.toISOString(),
        endTime: endDateUTC.toISOString(),
        date: new Date(year, month - 1, day).toISOString().split("T")[0],
      };

      // TODO: Implementar a chamada à API
      console.log("Dados do agendamento:", appointmentData);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulação de envio
    } catch (error) {
      console.error("Erro ao processar agendamento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!agendamento) return;

    const confirmed = window.confirm(
      "Você tem certeza que deseja excluir o agendamento?"
    );

    if (confirmed) {
      setIsLoading(true);
      try {
        const response = await api.delete(
          `/api/dashboard?id=${agendamento.id}`
        );

        if (response.status === 200) {
          alert("Agendamento excluído com sucesso.");
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
        <select
          {...register("status")}
          className="w-full p-2 border rounded-md"
          disabled
        >
          <option value="pendente">Pendente</option>
          <option value="confirmado">Confirmado</option>
        </select>
      </div>

      <div className="w-full p-2 border rounded-md bg-gray-100">
        <p className="text-sm text-gray-500">Sala</p>
        <p>{agendamento?.room || "Não selecionado"}</p>
      </div>

      <div className="w-full p-2 border rounded-md bg-gray-100">
        <p className="text-sm text-gray-500">Data do Agendamento</p>
        <p>
          {agendamento?.date
            ? new Date(agendamento.date).toLocaleDateString("pt-BR")
            : "Não selecionado"}
        </p>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="w-full p-2 border rounded-md bg-gray-100">
          <p className="text-sm text-gray-500">Horário de Início</p>
          <p>
            {agendamento?.startTime
              ? formatTime(agendamento.startTime)
              : "Não selecionado"}
          </p>
        </div>

        <div className="w-full p-2 border rounded-md bg-gray-100">
          <p className="text-sm text-gray-500">Horário de Término</p>
          <p>
            {agendamento?.endTime
              ? formatTime(agendamento.endTime)
              : "Não selecionado"}
          </p>
        </div>
      </div>

      <div className="w-full p-2 border rounded-md bg-gray-100">
        <p className="text-sm text-gray-500">Cliente</p>
        <p>{agendamento?.customer?.name || "Não selecionado"}</p>
      </div>

      <div className="w-full p-2 border rounded-md bg-gray-100">
        <p className="text-sm text-gray-500">Serviço</p>
        <p>{agendamento?.service?.name || "Não selecionado"}</p>
      </div>

      <div className="w-full p-2 border rounded-md bg-gray-100">
        <p className="text-sm text-gray-500">Profissional</p>
        <p>{agendamento?.professional?.name || "Não selecionado"}</p>
      </div>

      <div className="flex flex-row gap-4 mt-6">
        <Button
          type="submit"
          className="w-1/2 h-[50px] bg-yellow-400 hover:bg-yellow-700 text-black"
          disabled={isLoading}
        >
          {isLoading ? <FiLoader className="animate-spin mr-2" /> : null}
          Confirmar Agendamento
        </Button>

        <Button
          type="button"
          className="w-1/2 h-[50px] bg-red-400 hover:bg-red-700 text-white"
          onClick={handleDeleteAppointment}
          disabled={isLoading}
        >
          {isLoading ? <FiLoader className="animate-spin mr-2" /> : null}
          Excluir Agendamento
        </Button>
      </div>
    </form>
  );
}
