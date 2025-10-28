// src/presentation/hooks/useInvoices.ts

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  const hasLoadedRef = useRef(false);

  // Memoizar la función de carga para evitar recreaciones
  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchInvoicesUseCase.execute();
      setInvoices(data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar facturas';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoizar la función de creación
  const createInvoice = useCallback(async (createInvoiceDto: CreateInvoiceDTOType) => {
    try {
      const created = await createInvoiceUseCase.execute(createInvoiceDto);
      setInvoices((prev) => [created, ...prev]);
      return created;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear factura';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Memoizar la función de eliminación
  const deleteInvoice = useCallback(async (id: string) => {
    try {
      await eraseInvoiceUseCase.execute(id);
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar factura';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Memoizar la función de actualización
  const updateInvoice = useCallback(async (invoice: InvoiceDTOType, invoiceId: String) => {
    try {
      const updated = await updateInvoiceUseCase.execute(invoice, invoiceId);
      setInvoices((prev) =>
        prev.map((inv) => (inv._id === updated._id ? updated : inv))
      );
      return updated;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar factura';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Memoizar la función de pago
  const payInvoice = useCallback(async (paymentData: { id: string; paymentMethod: string; date: string }) => {
    try {
      const paidInvoice = await payInvoiceUseCase.execute(paymentData);
      setInvoices((prev) =>
        prev.map((inv) => (inv._id === paidInvoice._id ? paidInvoice : inv))
      );
      setInvoices((prev) =>
        prev.filter((inv) => inv._id !== paidInvoice._id)
      );
      return paidInvoice;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al pagar factura';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Memoizar facturas pendientes
  const pendingInvoices = useMemo(() => 
    invoices.filter((inv) => !inv.paid), [invoices]
  );

  // Memoizar facturas pagadas
  const paidInvoices = useMemo(() => 
    invoices.filter((inv) => inv.paid), [invoices]
  );

  // Cargar facturas al montar el componente
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadInvoices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    invoices,
    pendingInvoices,
    paidInvoices,
    loading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    payInvoice,
    reload: loadInvoices,
    clearError: () => setError(null),
  };
}
