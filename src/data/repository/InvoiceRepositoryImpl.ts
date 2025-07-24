import { Invoice } from '@/domain/model/Invoice';
import { InvoiceRepository } from '@/domain/repository/InvoiceRepository';
import { InvoiceAPI } from '@/data/api/InvoiceAPI';
import { InvoiceDTOType } from '@/presentation/dtos/InvoiceDto';

export class InvoiceRepositoryImpl implements InvoiceRepository {
  async getAll(): Promise<Invoice[]> {
    return await InvoiceAPI.fetchInvoices();
  }

  async create(data: Invoice): Promise<Invoice> {
    return await InvoiceAPI.createInvoice(data);
  }

  async update(invoice: InvoiceDTOType): Promise<Invoice> {
    return InvoiceAPI.updateInvoice(invoice);
  }

  async pay(
    invoiceId: String,
    paymentMethod: String,
    date: Date
  ): Promise<Invoice> {
    return InvoiceAPI.payInvoice(invoiceId, paymentMethod, date);
  }
}