import { Invoice } from '@/domain/model/Invoice';
import { InvoiceDTOType } from '@/presentation/dtos/InvoiceDto';
import { InvoiceRepository } from '@/domain/repository/InvoiceRepository';

export class PayInvoiceUseCase {
  constructor(private repository: InvoiceRepository) {}

  async execute(
    id: String,
    paymentMethod: String,
    date: Date
  ): Promise<Invoice> {
    return this.repository.pay(id, paymentMethod, date);
  }
}
