export interface FinanceiroData {
  receitaBrutaTotal: number;
  receitaLiquidaClinica: number;
  custosTotaisClinica: number;
  lucroLiquidoClinica: number;
  ticketMedioBruto: number;
  ticketMedioLiquidoClinica: number;
  receitaBrutaPorProfissional: {
    profissional: string;
    valor: number;
  }[];
  receitaBrutaPorServico: {
    servico: string;
    valor: number;
  }[];
}