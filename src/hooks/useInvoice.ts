// src/presentation/hooks/useInvoices.ts

import { useState, useEffect } from 'react';
import { Invoice } from '@/domain/model/Invoice';
import {
  fetchInvoicesUseCase,
  createInvoiceUseCase,
  updateInvoiceUseCase,
  payInvoiceUseCase,
} from '@/application/di/invoiceInstance';
import { InvoiceDTOType } from '@/presentation/dtos/InvoiceDto';

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

  const createInvoice = async (invoiceDto: InvoiceDTOType) => {
    const created = await createInvoiceUseCase.execute(invoiceDto);
    setInvoices((prev) => [created, ...prev]);
    return created;
  };

  const updateInvoice = async (invoice: InvoiceDTOType) => {
    const updated = await updateInvoiceUseCase.execute(invoice);
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
    reload: loadInvoices,
  };
}
