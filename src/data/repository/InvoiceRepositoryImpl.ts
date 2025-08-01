import { Invoice } from '@/domain/model/Invoice';
import { InvoiceRepository } from '@/domain/repository/InvoiceRepository';
import { InvoiceAPI } from '@/data/api/InvoiceAPI';
import { InvoiceDTOType } from '@/presentation/dtos/invoice/InvoiceDto';
import { CreateInvoiceDTOType } from '@/presentation/dtos/invoice/CreateInvoiceDto';

export class InvoiceRepositoryImpl implements InvoiceRepository {
  async getAll(): Promise<Invoice[]> {
    return await InvoiceAPI.fetchInvoices();
  }

  async create(data: CreateInvoiceDTOType): Promise<Invoice> {
    return await InvoiceAPI.createInvoice(data);
  }

  async update(invoice: InvoiceDTOType, invoiceId: String): Promise<Invoice> {
    return InvoiceAPI.updateInvoice(invoice, invoiceId);
  }

  async pay(
    invoiceId: String,
    paymentMethod: String,
    date: Date
  ): Promise<Invoice> {
    return InvoiceAPI.payInvoice(invoiceId, paymentMethod, date);
  }

  async delete(invoiceId: String): Promise<Invoice> {
    return InvoiceAPI.deleteInvoice(invoiceId);
  }
}
