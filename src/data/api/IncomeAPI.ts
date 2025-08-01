import { Income } from '@/domain/model/Income';
import api from '@/config/api';
import { CreateIncomeDTOType } from '@/presentation/dtos/income/createIncomeDto';

export const IncomeAPI = {
  // data/repository/IncomeRepositoryImpl.ts

  async fetchIncomes(filters?: {
    startDate?: string;
    finishDate?: string;
  }): Promise<Income[]> {
    const res = await api.post('/incomes/get', filters || {});
    return res.data.incomes;
  },
  async createIncome(data: CreateIncomeDTOType): Promise<Income> {
    try {
      const res = await api.post('/incomes/create', data);
      return res.data.incomes;
    } catch (error: any) {
      // Podés loguear, lanzar un error personalizado, o manejar según el status
      if (error.response?.status === 404) {
        throw new Error('El endpoint /incomes/create no fue encontrado (404)');
      }
      console.log(error, 'from incompeapi');
      // Reenviás el mensaje por defecto si no es 404
      throw new Error(error);
    }
  },

  async updateIncome(
    data: CreateIncomeDTOType,
    incomeId: String
  ): Promise<Income> {
    const res = await api.put(`/incomes/${incomeId}`, data);
    return res.data.income;
  },
};
