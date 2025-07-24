import { Invoice } from '@/domain/model/Invoice';
import { InvoiceRepository } from '@/domain/repository/InvoiceRepository';

export class FetchInvoicesUseCase {
  constructor(private repository: InvoiceRepository) {}

  async execute(): Promise<Invoice[]> {
    return this.repository.getAll();
  }
}
