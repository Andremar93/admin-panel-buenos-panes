
import { FetchExchangeRateUseCase } from '@/application/use_case/exchange_rate/FetchExchangeRateUseCase';
import { ExchangeRateRepositoryRepositoryImpl } from '@/data/repository/ExchangeRateRepositoryImpl';

const repository = new ExchangeRateRepositoryRepositoryImpl();

export const fetchExchangeRateUseCase = new FetchExchangeRateUseCase(repository);
