import React, { useState } from 'react';
import { Invoice } from '@/domain/model/Invoice';
import { PayInvoiceModal } from '@/presentation/screens/invoice/PayInvoiceModal';
import { useInvoices } from '@/hooks/useInvoice';
import { UpdateInvoiceDTOType } from '@/presentation/dtos/invoice/UpdateInvoiceDto';
import { FormattedAmount } from '../components/FormattedAmount';
import { FormattedDate } from '@/presentation/screens/components/FormattedDate';
interface Props {
  invoices: Invoice[];
  onDelete: (invoiceId: String) => void;
  loading: boolean;
  error: string | null;
  onEdit: (invoice: UpdateInvoiceDTOType) => void;
}

export const InvoiceList: React.FC<Props> = ({
  invoices,
  loading,
  error,
  onEdit,
  onDelete,
}) => {
  const { payInvoice } = useInvoices();

  const [selectedToPay, setSelectedToPay] = useState<Invoice | null>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');

  const filteredInvoices = invoices.filter((invoice) =>
    `${invoice.supplier} ${invoice.numeroFactura}`.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPendienteDolares = filteredInvoices
    .filter((inv) => !inv.paid)
    .reduce((acc, inv) => acc + inv.amountDollars, 0);

  const totalPendienteBs = filteredInvoices
    .filter((inv) => !inv.paid)
    .reduce((acc, inv) => acc + inv.amountBs, 0);

  const handlePay = (date: string) => {
    if (selectedToPay) {
      payInvoice({
        id: selectedToPay._id,
        paymentMethod: 'Transferencia',
        date,
      });
      setSelectedToPay(null);
    }
  };

  return (
    <div style={{ flex: 1, paddingLeft: 20 }}>
      {/* Resumen total */}
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
        <p className="text-md font-bold text-yellow-900">
          Total facturas por pagar: {filteredInvoices.filter((i) => !i.paid).length}
        </p>
        <p className="text-lg font-bold text-yellow-900">
          <FormattedAmount amount={totalPendienteDolares} currency="USD" /> /{' '}
          <FormattedAmount amount={totalPendienteBs} currency="Bs" prefix="" />
        </p>
      </div>

      {/* Filtro */}
      <input
        type="text"
        placeholder="Buscar por proveedor o número de factura"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="input mb-4"
      />

      {/* Encabezado */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Facturas:</h2>

      {/* Estados */}
      {loading && <p className="text-gray-500">Cargando facturas...</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}
      {!loading && invoices.length === 0 && <p className="text-gray-400">No hay facturas registradas.</p>}

      {/* Lista */}
      <ul className="space-y-4">
        {filteredInvoices.map((invoice) => (
          <li key={invoice._id} className="bg-white p-4 rounded-lg shadow flex flex-col">
            {/* Proveedor y número */}
            <div className="font-semibold text-primary">
              {invoice.supplier} - #{invoice.numeroFactura}
            </div>

            {/* Monto */}
            <div className="text-sm text-gray-600">
              <FormattedAmount amount={invoice.amountDollars} currency="USD" /> / <FormattedAmount amount={invoice.amountBs} currency="Bs" />
            </div>

            {/* Vencimiento */}
            <div className="text-xs text-gray-500">
              Vencimiento:  <FormattedDate date={invoice.dueDate} />
            </div>

            {/* Acciones */}
            <div className="mt-2 flex gap-4">
              <button
                onClick={() => onEdit(invoice)}
                className="text-sm text-blue-500 underline"
              >
                Editar
              </button>

              <button
                onClick={() => setSelectedToPay(invoice)}
                className="text-sm text-green-600 underline"
              >
                Pagar factura
              </button>

              {/* Modal de pago */}
              {selectedToPay && selectedToPay._id === invoice._id && (
                <PayInvoiceModal
                  invoice={selectedToPay}
                  onClose={() => setSelectedToPay(null)}
                  onConfirm={handlePay}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
