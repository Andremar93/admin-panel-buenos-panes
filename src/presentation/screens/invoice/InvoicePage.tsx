import { useState } from 'react';
import { useInvoices } from '@/hooks/useInvoice';
import { Invoice } from '@/domain/model/Invoice';
import { CreateInvoiceForm } from '@/presentation/screens/invoice/CreateInvoiceForm';
import { EditInvoiceForm } from '@/presentation/screens/invoice/EditInvoiceForm';
import { InvoiceList } from '@/presentation/screens/invoice/InvoiceList';

export const InvoicePage = () => {
  const { invoices, loading, error, createInvoice, updateInvoice } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleCreated = (invoice: Invoice) => {
    createInvoice(invoice);
    setSelectedInvoice(null);
  };

  const handleUpdated = async (data: Invoice) => {
    await updateInvoice(data);
    setSelectedInvoice(null);
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
        error={error}
        onEdit={setSelectedInvoice}
      />

    </div>
  );
};
