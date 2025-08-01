import { IncomeRepositoryImpl } from '@/data/repository/IncomeRepositoryImpl';
import { CreateIncomeUseCase } from '@/application/use_case/income/CreateIncomeUseCase';
import { FetchIncomesUseCase } from '@/application/use_case/income/FetchIncomesUseCase';
import { UpdateIncomeUseCase } from '@/application/use_case/income/UpdateIncomeUseCase';
// import { EraseIncomeUseCase } from '@/application/use_case/income/'

const repository = new IncomeRepositoryImpl();

export const createIncomeUseCase = new CreateIncomeUseCase(repository);
export const fetchIncomesUseCase = new FetchIncomesUseCase(repository);
export const updateIncomeUseCase = new UpdateIncomeUseCase(repository);
// export const eraseIncomeUseCase = new EraseIncomeUseCase(repository);
