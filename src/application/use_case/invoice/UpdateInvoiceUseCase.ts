import { Invoice } from '@/domain/model/Invoice';
import { InvoiceDTOType } from '@/presentation/dtos/InvoiceDto';
import { InvoiceRepository } from '@/domain/repository/InvoiceRepository';

export class UpdateInvoiceUseCase {
  constructor(private repository: InvoiceRepository) {}

  async execute( data: InvoiceDTOType): Promise<Invoice> {
    return this.repository.update(data);
  }
}
