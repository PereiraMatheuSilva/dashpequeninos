import axios from 'axios';

const api = axios.create({
  baseURL:process.env.HOST_URL as string
});

export const getReceitaTotal = async (startDate: string, endDate: string) => {
  try {
    const response = await api.get(`/receita-total?startDate=${startDate}&endDate=${endDate}`);
    return response.data.receitaTotal;
  } catch (error) {
    console.error('Erro ao buscar receita total:', error);
    throw error; // Rejeita o erro para que o componente possa tratá-lo
  }
};

export const getCustosTotais = async (startDate: string, endDate: string) => {
  try {
    const response = await api.get(`/custos-totais?startDate=${startDate}&endDate=${endDate}`);
    return response.data.custosTotais;
  } catch (error) {
    console.error('Erro ao buscar custos totais:', error);
    throw error;
  }
};

export const getTotalAtendimentos = async (startDate: string, endDate: string) => {
  try {
    const response = await api.get(`/total-atendimentos?startDate=${startDate}&endDate=${endDate}`);
    return response.data.totalAtendimentos;
  } catch (error) {
    console.error('Erro ao buscar total de atendimentos:', error);
    throw error;
  }
};
