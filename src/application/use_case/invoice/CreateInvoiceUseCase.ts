import { InvoiceDTOType } from '@/presentation/dtos/InvoiceDto';
import { InvoiceRepository } from '@/domain/repository/InvoiceRepository';
import { Invoice } from '@/domain/model/Invoice';
export class CreateInvoiceUseCase {
  constructor(private repository: InvoiceRepository) {}

  async execute(data: InvoiceDTOType): Promise<Invoice> {
    return this.repository.create(data);
  }
}
