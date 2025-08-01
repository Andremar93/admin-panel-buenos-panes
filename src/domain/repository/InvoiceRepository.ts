import { Invoice } from '@/domain/model/Invoice';
import { InvoiceDTOType } from '@/presentation/dtos/invoice/InvoiceDto';
import { CreateInvoiceDTOType } from '@/presentation/dtos/invoice/CreateInvoiceDto';

export interface InvoiceRepository {
  create(expense: CreateInvoiceDTOType): Promise<Invoice>;
  update(invoice: InvoiceDTOType, invoiceId: String): Promise<Invoice>;
  pay(invoiceId: String, paymentMethod: String, date: Date): Promise<Invoice>;
  getAll(): Promise<Invoice[]>;
  delete(invoiceId: String): Promise<Invoice>;
}
