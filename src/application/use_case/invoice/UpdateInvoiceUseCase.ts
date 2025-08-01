import { Invoice } from '@/domain/model/Invoice';
import { InvoiceDTOType } from '@/presentation/dtos/invoice/InvoiceDto';
import { InvoiceRepository } from '@/domain/repository/InvoiceRepository';

export class UpdateInvoiceUseCase {
  constructor(private repository: InvoiceRepository) {}

  async execute(data: InvoiceDTOType, invoiceId: String): Promise<Invoice> {
    return this.repository.update(data, invoiceId);
  }
}
