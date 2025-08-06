import api from '@/config/api';
import ExchangeRate from '@/domain/model/ExchangeRate';

export const ExchangeRateAPI = {
    async fetchExchangeRate(date: string): Promise<ExchangeRate[]> {
        const res = await api.get(`/exchange-rate/get/${date}`, {
        });
        console.log(res)
        return res.data.rate;
    }
};
