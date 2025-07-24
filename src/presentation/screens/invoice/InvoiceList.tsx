import { Invoice } from '@/domain/model/Invoice';
import React, { useState } from 'react';
import { PayInvoiceModal } from '@/presentation/screens/invoice/PayInvoiceModal';
import { useInvoices } from '@/hooks/useInvoice'

interface Props {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  onEdit: (invoice: Invoice) => void;
}

export const InvoiceList: React.FC<Props> = ({ invoices, loading, error, onEdit }) => {

  const { payInvoice } = useInvoices()

  const [selectedToPay, setSelectedToPay] = useState<Invoice | null>(null);


  const [filterText, setFilterText] = useState('');

  const filteredInvoices = invoices.filter((invoice) =>
    `${invoice.supplier} ${invoice.numeroFactura}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const totalPendienteDolares = invoices
    .filter((inv) => !inv.paid)
    .reduce((acc, inv) => acc + inv.amountDollars, 0);

  const totalPendienteBs = invoices
    .filter((inv) => !inv.paid)
    .reduce((acc, inv) => acc + inv.amountBs, 0);


  const handlePay = (date: string) => {

    setSelectedToPay(null);
    payInvoice({
      id: selectedToPay?._id,
      paymentMethod: 'Transferencia',
      date
    });

  };

  return (
    <div style={{ flex: 1, paddingLeft: 20 }}>

      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
        <h3 className="text-sm font-medium text-yellow-800 mb-1">
          Total pendiente por pagar:
        </h3>
        {/* <p> Total facturas por pagar: {invoices.length}</p> */}
        <p className="text-lg font-bold text-yellow-900">
          ${totalPendienteDolares.toFixed(2)} / {totalPendienteBs.toFixed(2)} Bs
        </p>
      </div>


      <input
        type="text"
        placeholder="Buscar por proveedor o número de factura"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="input mb-4"
      />


      <h2 className="text-xl font-bold text-gray-800 mb-4">Facturas:</h2>

      {loading && <p className="text-gray-500">Cargando facturas...</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}
      {!loading && invoices.length === 0 && <p className="text-gray-400">No hay facturas registradas.</p>}

      <ul className="space-y-4">
        {filteredInvoices.map((invoice) => (
          <li key={invoice._id} className="bg-white p-4 rounded-lg shadow flex flex-col">
            <div className="font-semibold text-primary">{invoice.supplier} - #{invoice.numeroFactura}</div>
            <div className="text-sm text-gray-600">
              {invoice.amountDollars} {invoice.currency}
            </div>
            <div className="text-xs text-gray-400">
              Fecha de Vencimiento: {new Date(invoice.dueDate).toLocaleDateString()}
            </div>

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


              {selectedToPay && (
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
