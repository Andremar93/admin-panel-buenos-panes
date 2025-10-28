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
  exchangeRate: string;
  onEdit: (invoice: UpdateInvoiceDTOType) => void;
}

export const InvoiceList: React.FC<Props> = ({
  invoices,
  loading,
  error,
  onEdit,
  exchangeRate,
  onDelete,
}) => {
  const { payInvoice } = useInvoices();

  const [selectedToPay, setSelectedToPay] = useState<Invoice | null>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const toggleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoices((prevSelected) =>
      prevSelected.includes(invoiceId)
        ? prevSelected.filter((id) => id !== invoiceId)
        : [...prevSelected, invoiceId]
    );
  };


  const filteredInvoices = invoices
    .filter((invoice) =>
      `${invoice.supplier} ${invoice.numeroFactura}`.toLowerCase().includes(filterText.toLowerCase())
    )


  const selectedTotalUSD = filteredInvoices
    .filter((inv) => selectedInvoices.includes(inv._id))
    .reduce((acc, inv) => acc + inv.amountDollars, 0);

  const selectedTotalBs = selectedTotalUSD * Number(exchangeRate);


  const totalPendienteDolares = filteredInvoices
    .filter((inv) => !inv.paid)
    .reduce((acc, inv) => acc + inv.amountDollars, 0);

  const totalPendienteBs = (totalPendienteDolares * Number(exchangeRate))

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


        {selectedInvoices.length > 0 && (
          <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded">
            <p className="text-md font-bold text-green-900">
              Total seleccionado para pagar: {selectedInvoices.length} factura(s)
            </p>
            <p className="text-lg font-bold text-green-900">
              <FormattedAmount amount={selectedTotalUSD} currency="USD" /> /{' '}
              <FormattedAmount amount={selectedTotalBs} currency="Bs" prefix="" />
            </p>
          </div>
        )}


      </div>

      {/* Filtro */}
      <form className="form-form-container form-container-no-shadow">
        <div className="form-group">
          <label className="form-label">Buscar por proveedor o número de factura</label>
          <input
            type="text"
            placeholder="Buscar por proveedor o número de factura"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="form-input mb-4"
          />
        </div>
      </form>
      {/* Encabezado */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Facturas:</h2>

      {/* Estados */}
      {loading && <p className="text-gray-500">Cargando facturas...</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}
      {!loading && invoices.length === 0 && <p className="text-gray-400">No hay facturas registradas.</p>}

      {/* Lista */}
      <ul className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {filteredInvoices.map((invoice) => (
          <li
            key={invoice._id}
            className="bg-white p-4 rounded-2xl shadow flex flex-col gap-2 border border-gray-200 relative"
          >
            {/* Contenedor principal con flex horizontal para checkbox + contenido */}
            <div className="flex items-start gap-3">
              {/* Checkbox a la izquierda */}
              <input
                type="checkbox"
                checked={selectedInvoices.includes(invoice._id)}
                onChange={() => toggleInvoiceSelection(invoice._id)}
                className="accent-green-600 mt-1"
              />

              {/* Contenido de la factura */}
              <div className="flex-1 flex flex-col gap-2">
                {/* Vencimiento arriba a la derecha */}
                {(() => {
                  const dueDate = new Date(invoice.dueDate);
                  const isOverdue = dueDate < new Date();

                  return (
                    <div
                      className={`absolute top-4 right-4 text-sm font-semibold ${isOverdue ? 'text-red-600' : 'text-green-600'
                        }`}
                    >
                      Vence: <FormattedDate date={invoice.dueDate} />
                    </div>
                  );
                })()}

                {/* Título */}
                <div className="text-lg font-semibold text-gray-800">
                  {invoice.supplier} - #{invoice.numeroFactura}
                </div>

                {/* Fecha de creación */}
                <div className="text-sm text-gray-500">
                  Fecha de creación: <FormattedDate date={invoice.date} /> /
                  Creado por: {invoice.createdBy}
                </div>

                {/* Monto */}
                <div className="text-base font-medium text-gray-700">
                  💵 <FormattedAmount amount={invoice.amountDollars} currency="USD" /> /{' '}
                  <FormattedAmount
                    prefix=""
                    amount={invoice.amountDollars * exchangeRate}
                    currency="Bs"
                  />
                </div>

                {/* Acciones */}
                <div className="mt-2 flex gap-2 flex-wrap">
                  <button
                    onClick={() => onEdit(invoice)}
                    className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    🖉 Editar
                  </button>

                  <button
                    onClick={() => setSelectedToPay(invoice)}
                    className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    💳 Pagar factura
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
              </div>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
};
