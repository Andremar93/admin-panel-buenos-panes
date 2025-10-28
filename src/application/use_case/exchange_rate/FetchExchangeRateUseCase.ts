import ExchangeRate from '@/domain/model/ExchangeRate';
import { ExchangeRateRepository } from '@/domain/repository/ExchangeRepository';

export class FetchExchangeRateUseCase {
    constructor(private repository: ExchangeRateRepository) { }

    async execute(date: string): Promise<ExchangeRate> {
        return this.repository.get(date);
    }
}
