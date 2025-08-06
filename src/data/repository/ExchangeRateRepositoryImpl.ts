import { ExchangeRateRepository } from "@/domain/repository/ExchangeRepository";
import { ExchangeRateAPI } from "../api/ExchangeRateAPI";
import ExchangeRate from "@/domain/model/ExchangeRate";

export class ExchangeRateRepositoryRepositoryImpl implements ExchangeRateRepository {
    private cache: Map<string, ExchangeRate[]> = new Map();

    async get(date: string): Promise<ExchangeRate[]> {

        if (this.cache.has(date)) {
            return this.cache.get(date)!;
        }

        const exchangeRates = await ExchangeRateAPI.fetchExchangeRate(date);
        console.log(exchangeRates, 'fromrepo')

        this.cache.set(date, exchangeRates);

        return exchangeRates;
    }
}


