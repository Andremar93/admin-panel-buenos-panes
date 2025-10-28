import { useState, useEffect } from 'react';
import { useInvoices } from '@/hooks/useInvoice';
import { CreateInvoiceDTOType } from '@/presentation/dtos/invoice/CreateInvoiceDto';
import { CreateInvoiceForm } from '@/presentation/screens/invoice/CreateInvoiceForm';
import { EditInvoiceForm } from '@/presentation/screens/invoice/EditInvoiceForm';
import { InvoiceList } from '@/presentation/screens/invoice/InvoiceList';
import { UpdateInvoiceDTOType } from '@/presentation/dtos/invoice/UpdateInvoiceDto';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export const InvoicePage = () => {
  const { invoices, loading, error, updateInvoice, createInvoice, deleteInvoice } = useInvoices();
  const { user, loading: userLoading } = useCurrentUser();
  const { exchangeRate, getExchangeRate } = useExchangeRate();
  const [selectedInvoice, setSelectedInvoice] = useState<UpdateInvoiceDTOType | null>(null);


  useEffect(() => {
    getExchangeRate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleCreated = async (data: CreateInvoiceDTOType) => {
    await createInvoice(data);
  };

  const handleUpdated = async (invoiceId: string, data: UpdateInvoiceDTOType) => {
    await updateInvoice(data, invoiceId);
  };

  if (userLoading) {
    return <div className="page-container">Cargando usuario…</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Gestión de Facturas</h1>
        <p className="page-subtitle">
          Crea nuevas facturas de proveedores y administra las existentes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Columna Izquierda - Formulario */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedInvoice ? 'Editar Factura' : 'Crear Nueva Factura'}
              </h2>
            </div>
            <div className="card-body">
              {selectedInvoice ? (
                <EditInvoiceForm
                  initialData={selectedInvoice}
                  onCancel={() => setSelectedInvoice(null)}
                  onUpdated={handleUpdated}
                  userName={user?.username ?? ''}
                />
              ) : (
                <CreateInvoiceForm onCreated={handleCreated} userName={user?.username ?? ''} />
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha - Lista de Facturas */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Facturas</h2>
            </div>
            <div className="card-body">
              <InvoiceList
                invoices={invoices}
                loading={loading}
                exchangeRate={exchangeRate?.rate}
                error={error}
                onEdit={setSelectedInvoice}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
