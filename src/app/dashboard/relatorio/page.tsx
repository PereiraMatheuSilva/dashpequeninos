'use client'

import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartOverView from '@/components/chart';
import { api } from '@/lib/api';


export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>();
  const [receitaTotal, setReceitaTotal] = useState<number | null>(null);
  const [custosTotais, setCustosTotais] = useState<number | null>(null);
  const [totalAtendimentos, setTotalAtendimentos] = useState<number | null>(null);
  const [lucroTotal, setLucroTotal] = useState<number | null>(null);
  const [ticketMedio, setTicketMedio] = useState<number | null>(null);
  const [mediaDiaria, setMediaDiaria] = useState<number | null>(null);
  const [horarioPico, setHorarioPico] = useState<number | null>(null); 

  const [profissional, setProfissional] = useState('');

  const [dataInicial, setDataInicial] = useState<string>("");
  const [dataFinal, setDataFinal] = useState<string>("");

  async function fetchAtendimentos(startDate?: Date, endDate?: Date) {
  if (!startDate || !endDate) return;

  try {
    const { data: total_atendimento } = await api.get("/api/dashboard/total-atendimentos", {
      params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    });

    const { data: custos } = await api.get('/api/dashboard/custos-totais', {
      params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    });

    const { data: receita } = await api.get('/api/dashboard/receita-total', {
      params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    });

    const { data: lucro } = await api.get('/api/dashboard/lucro-total', {
      params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    });

    const { data: ticket } = await api.get('/api/dashboard/ticket-medio', {
      params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    });

    const { data: mediadiaria } = await api.get('/api/dashboard/media-diaria', {
      params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    });

    const { data: hsPico } = await api.get('/api/dashboard/horario-pico', {
      params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    });

    const { data: doctorActive } = await api.get('/api/dashboard/profissional-mais-ativo', {
      params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    });


    console.log(profissional)

    setHorarioPico(hsPico.horarioPico);
    setReceitaTotal(receita.receitaTotal);
    setCustosTotais(custos.custosTotais);
    setTotalAtendimentos(total_atendimento.totalAtendimentos);
    setLucroTotal(lucro.lucroTotal);
    setTicketMedio(ticket.ticketMedio);
    setMediaDiaria(mediadiaria.mediaDiaria);
    setProfissional(doctorActive.profissional);
  } catch (error) {
    console.error("Erro ao buscar atendimentos:", error);
  }
  }


  useEffect(() => {
    if (date?.from && date?.to) {
      fetchAtendimentos(date.from, date.to);
    }
  }, [date]);

  const handleSubmit = () => {
    if (!dataInicial || !dataFinal) {
      alert("Selecione as datas!");
      return;
    }
    fetchAtendimentos(new Date(dataInicial), new Date(dataFinal));
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={dataInicial}
          onChange={(e) => setDataInicial(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={dataFinal}
          onChange={(e) => setDataFinal(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">
          Enviar Datas
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Custos Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold">R$ {(receitaTotal ?? 0) - (custosTotais ?? 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold">R$ {receitaTotal ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total de Atendimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold">{totalAtendimentos ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lucro Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold">R$ {lucroTotal ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold">{ticketMedio ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Média Diária</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold">{mediaDiaria ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horário Pico</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold">{horarioPico ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profissional Mais Ativo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold">{ticketMedio ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita por profissional</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold">{profissional ?? 0}</p>
          </CardContent>
        </Card>
      </div>
     
    </div>
  );
}
