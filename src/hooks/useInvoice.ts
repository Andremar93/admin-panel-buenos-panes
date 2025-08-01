// src/presentation/hooks/useInvoices.ts

import { useState, useEffect } from 'react';
import { Invoice } from '@/domain/model/Invoice';
import {
  fetchInvoicesUseCase,
  createInvoiceUseCase,
  updateInvoiceUseCase,
  payInvoiceUseCase,
  eraseInvoiceUseCase,
} from '@/application/di/invoiceInstance';
import { InvoiceDTOType } from '@/presentation/dtos/invoice/InvoiceDto';
import { CreateInvoiceDTOType } from '@/presentation/dtos/invoice/CreateInvoiceDto';

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await fetchInvoicesUseCase.execute();
      setInvoices(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar facturas');
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (createInvoiceDto: CreateInvoiceDTOType) => {
    const created = await createInvoiceUseCase.execute(createInvoiceDto);
    setInvoices((prev) => [created, ...prev]);
    return created;
  };

  const deleteInvoice = async (id: string) => {
    await eraseInvoiceUseCase.execute(id);
    setInvoices((prev) => prev.filter((inv) => inv._id !== id));
  };

  const updateInvoice = async (invoice: InvoiceDTOType, invoiceId: String) => {
    const updated = await updateInvoiceUseCase.execute(invoice, invoiceId);
    setInvoices((prev) =>
      prev.map((inv) => (inv._id === updated._id ? updated : inv))
    );
    return updated;
  };

  const payInvoice = async ({
    id,
    paymentMethod,
    date,
  }: {
    id: string;
    paymentMethod: string;
    date: Date;
  }) => {
    const payed = await payInvoiceUseCase.execute(id, paymentMethod, date);

    if (!payed || !payed._id) {
      console.error(
        'Error: la factura pagada no fue devuelta correctamente:',
        payed
      );
      return;
    }

    setInvoices((prev) =>
      prev.map((inv) => (inv._id === payed._id ? payed : inv))
    );

    return payed;
  };

  return {
    invoices,
    loading,
    error,
    createInvoice,
    updateInvoice,
    payInvoice,
    deleteInvoice,
    reload: loadInvoices,
  };
}
