import { Invoice } from '@/domain/model/Invoice';
import { InvoiceRepository } from '@/domain/repository/InvoiceRepository';

export class EraseInvoiceUseCase {
  constructor(private repository: InvoiceRepository) {}

  async execute(invoiceId: String): Promise<Invoice> {
    return this.repository.delete(invoiceId);
  }
}
