import { InvoiceRepositoryImpl } from '@/data/repository/InvoiceRepositoryImpl';
import { CreateInvoiceUseCase } from '@/application/use_case/invoice/CreateInvoiceUseCase';
import { FetchInvoicesUseCase } from '@/application/use_case/invoice/FetchInvoiceUseCase';
import { UpdateInvoiceUseCase } from '@/application/use_case/invoice/UpdateInvoiceUseCase';
import { PayInvoiceUseCase } from '../use_case/invoice/PayInvoiceUseCase';

const repository = new InvoiceRepositoryImpl();

export const createInvoiceUseCase = new CreateInvoiceUseCase(repository);
export const fetchInvoicesUseCase = new FetchInvoicesUseCase(repository);
export const updateInvoiceUseCase = new UpdateInvoiceUseCase(repository);
export const payInvoiceUseCase = new PayInvoiceUseCase(repository);
