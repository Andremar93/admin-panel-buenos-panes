import ExchangeRate from '../model/ExchangeRate';

export interface ExchangeRateRepository {
    get(date: string): Promise<ExchangeRate[]>;
}
