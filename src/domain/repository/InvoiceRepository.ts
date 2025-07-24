import { Invoice } from '@/domain/model/Invoice';
import { InvoiceDTOType } from '@/presentation/dtos/InvoiceDto';

export interface InvoiceRepository {
  create(expense: InvoiceDTOType): Promise<Invoice>;
  update(invoice: InvoiceDTOType): Promise<Invoice>;
  pay(invoiceId: String, paymentMethod: String, date: Date): Promise<Invoice>;
  getAll(): Promise<Invoice[]>;
}
