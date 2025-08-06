
import { FetchExchangeRateUseCase } from '@/application/use_case/exchange_rate/fetchExchangeRateUseCase';
import { ExchangeRateRepositoryRepositoryImpl } from '@/data/repository/ExchangeRateRepositoryImpl';

const repository = new ExchangeRateRepositoryRepositoryImpl();

export const fetchExchangeRateUseCase = new FetchExchangeRateUseCase(repository);
