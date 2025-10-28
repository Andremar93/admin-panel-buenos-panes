// components/PayInvoiceModal.tsx
import React, { useEffect, useState } from 'react';
import { Invoice } from '@/domain/model/Invoice';
import { useExchangeRate } from '@/hooks/useExchangeRate'; // CAMBIO: usar el nuevo hook
import { FormattedAmount } from '../components/FormattedAmount';
import { Input, Button } from '@/presentation/components/ui';

interface Props {
    invoice: Invoice;
    onClose: () => void;
    onConfirm: (date: string) => void;
}

export const PayInvoiceModal: React.FC<Props> = ({ invoice, onClose, onConfirm }) => {
    const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const { exchangeRate, getExchangeRate, loading, error } = useExchangeRate();

    useEffect(() => {
        if (paymentDate) {
            getExchangeRate(paymentDate);
        }
    }, [paymentDate]);


    const handleConfirm = () => {
        onConfirm(paymentDate);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center form-form-container">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4 form-group">
                <h2 className="text-lg font-bold text-gray-800">Pagar Factura</h2>
                <p className="text-sm text-gray-600">
                    ¿Deseas marcar como pagada la factura de
                </p>
                <h2><strong>{invoice.supplier} - #{invoice.numeroFactura}</strong> ? </h2>


                <Input
                    label="Fecha de Pago"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                />

                {loading && <p className="text-sm text-gray-500">Cargando tasa de cambio...</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}
                {!loading && exchangeRate && (
                    <div>
                        <p className="text-sm text-green-700">
                            Tasa del día: <FormattedAmount prefix='' amount={exchangeRate.rate} currency="USD" />

                        </p>
                        <p className="text-sm text-green-700">
                            Monto a pagar:{" "}
                            <FormattedAmount
                                prefix=''
                                amount={
                                    isNaN(Number(exchangeRate.rate)) || isNaN(invoice.amountDollars)
                                        ? 0
                                        : invoice.amountDollars * Number(exchangeRate.rate)
                                }
                                currency="Bs"
                            />
                        </p>
                    </div>
                )}

                <div className="flex justify-end gap-4 pt-4">
                    <Button onClick={onClose} type="button" size="md" variant="secondary">Cancelar</Button>
                    <Button onClick={handleConfirm} type="submit" disabled={loading} size="md" variant="primary">Confirmar</Button>
                </div>
            </div>
        </div>
    );
};
