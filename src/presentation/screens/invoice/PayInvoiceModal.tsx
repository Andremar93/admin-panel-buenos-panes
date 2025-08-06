// components/PayInvoiceModal.tsx
import React, { useEffect, useState } from 'react';
import { Invoice } from '@/domain/model/Invoice';
import { useExchangeRate } from '@/hooks/useExchangeRate'; // CAMBIO: usar el nuevo hook
import { FormattedAmount } from '../components/FormattedAmount';

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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
                <h2 className="text-lg font-bold text-gray-800">Pagar Factura</h2>
                <p className="text-sm text-gray-600">
                    ¿Deseas marcar como pagada la factura de
                </p>
                <h2><strong>{invoice.supplier} - #{invoice.numeroFactura}</strong> ? </h2>

                <label className="text-sm font-medium text-gray-700">Fecha de Pago</label>
                <input
                    type="date"
                    className="input"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                />

                {loading && <p className="text-sm text-gray-500">Cargando tasa de cambio...</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}
                {!loading && exchangeRate && (
                    <div>
                        <p className="text-sm text-green-700">
                            Tasa del día: <FormattedAmount prefix='' amount={exchangeRate} currency="USD" />

                        </p>
                        <p className="text-sm text-green-700">
                            Monto a pagar:{" "}
                            <FormattedAmount
                                prefix=''
                                amount={
                                    isNaN(Number(exchangeRate)) || isNaN(invoice.amountDollars)
                                        ? 0
                                        : invoice.amountDollars * Number(exchangeRate)
                                }
                                currency="Bs"
                            />
                        </p>
                    </div>
                )}

                <div className="flex justify-end gap-4 pt-4">
                    <button onClick={onClose} className="btn-secondary">Cancelar</button>
                    <button onClick={handleConfirm} className="btn">Confirmar</button>
                </div>
            </div>
        </div>
    );
};
