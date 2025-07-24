import { Invoice } from '@/domain/model/Invoice';
import { InvoiceDTOType } from '@/presentation/dtos/InvoiceDto';
import api from '@/config/api';

export const InvoiceAPI = {
  async createInvoice(invoice: Invoice): Promise<Invoice> {
    const res = await api.post('/invoices/create', invoice);
    return res.data.invoice;
  },

  async updateInvoice(invoice: Invoice): Promise<Invoice> {
    console.log('Invoice:', invoice);
    const res = await api.put(`/expenses/update`, invoice);
    return res.data.invoice;
  },

  async payInvoice(
    invoiceId: String,
    paymentMethod: String,
    date: Date
  ): Promise<Invoice> {
    console.log('Invoice:', invoiceId);
    const res = await api.post(`/expenses/create-by-invoice`, {
      invoiceId,
      paymentMethod,
      date,
    });
    console.log('RESPONSE: ', res);
    return res.data.invoice;
  },

  async fetchInvoices(): Promise<Invoice[]> {
    const res = await api.get('/invoices/get');
    return res.data;
  },
};
