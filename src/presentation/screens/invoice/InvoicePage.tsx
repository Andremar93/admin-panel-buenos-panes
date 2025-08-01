import { useState } from 'react';
import { useInvoices } from '@/hooks/useInvoice';
import { CreateInvoiceDTOType } from '@/presentation/dtos/invoice/CreateInvoiceDto';
import { CreateInvoiceForm } from '@/presentation/screens/invoice/CreateInvoiceForm';
import { EditInvoiceForm } from '@/presentation/screens/invoice/EditInvoiceForm';
import { InvoiceList } from '@/presentation/screens/invoice/InvoiceList';
import { UpdateInvoiceDTOType } from '@/presentation/dtos/invoice/UpdateInvoiceDto';

export const InvoicePage = () => {
  const { invoices, loading, error, updateInvoice, createInvoice, deleteInvoice } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<UpdateInvoiceDTOType | null>(null);

  // const onDelete = async (invoiceId: string) => {
  //   await deleteInvoice(invoiceId);
  // }

  const handleCreated = async (data: CreateInvoiceDTOType) => {
    await createInvoice(data); // esto actualiza el estado del hook
  };

  const handleUpdated = async (invoiceId: string, data: UpdateInvoiceDTOType) => {
    await updateInvoice(data, invoiceId);
  };

  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>

      <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: 20 }}>

        {selectedInvoice ? (
          <EditInvoiceForm
            initialData={selectedInvoice}
            onCancel={() => setSelectedInvoice(null)}
            onUpdated={handleUpdated}
          />
        ) : (
          <CreateInvoiceForm onCreated={handleCreated} />
        )}
      </div>

      <InvoiceList
        invoices={invoices}
        loading={loading}
        // onDelete={onDelete}
        error={error}
        onEdit={setSelectedInvoice}
      />

    </div>
  );
};
