import React from 'react';

interface Props {
    amount: number;
    currency?: string; // USD, Bs, etc.
    bold?: boolean;
    prefix?: string;   // e.g. "$" or "Bs "
    className?: string;
}

export const FormattedAmount: React.FC<Props> = ({
    amount,
    currency = '',
    bold = true,
    prefix = '$',
    className = '',
}) => {
    const fixedAmount = Number(amount.toFixed(2));
    const finalPrefix = currency === 'Bs' ? '' : prefix;
    const formatted = `${finalPrefix}${fixedAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}${currency ? ` ${currency}` : ''}`;

    return bold ? (
        <strong className={className}>{formatted}</strong>
    ) : (
        <span className={className}>{formatted}</span>
    );
};
