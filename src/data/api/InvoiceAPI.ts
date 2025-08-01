import { Invoice } from '@/domain/model/Invoice';
import { InvoiceDTOType } from '@/presentation/dtos/invoice/InvoiceDto';
import { CreateInvoiceDTOType } from '@/presentation/dtos/invoice/CreateInvoiceDto';
import api from '@/config/api';

export const InvoiceAPI = {
  async createInvoice(invoice: CreateInvoiceDTOType): Promise<Invoice> {
    const res = await api.post('/invoices/create', invoice);
    return res.data.invoice;
  },

  async updateInvoice(
    invoice: InvoiceDTOType,
    invoiceId: String
  ): Promise<Invoice> {
    const res = await api.put(`/invoices/${invoiceId}`, invoice);
    return res.data.invoice;
  },

  async deleteInvoice(invoiceId: String): Promise<Invoice> {
    const res = await api.delete(`/invoices/${invoiceId}`);
    return res.data.invoice;
  },

  async payInvoice(
    invoiceId: String,
    paymentMethod: String,
    date: Date
  ): Promise<Invoice> {
    const res = await api.post(`/expenses/create-by-invoice`, {
      invoiceId,
      paymentMethod,
      date,
    });

    return res.data.invoice;
  },

  async fetchInvoices(): Promise<Invoice[]> {
    const res = await api.get('/invoices/get');
    return res.data;
  },
};
