import { CreateInvoiceDTOType } from '@/presentation/dtos/invoice/CreateInvoiceDto';
import { InvoiceRepository } from '@/domain/repository/InvoiceRepository';
import { Invoice } from '@/domain/model/Invoice';
export class CreateInvoiceUseCase {
  constructor(private repository: InvoiceRepository) {}

  async execute(data: CreateInvoiceDTOType): Promise<Invoice> {
    return this.repository.create(data);
  }
}
