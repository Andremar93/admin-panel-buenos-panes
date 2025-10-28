// components/FormattedDueDate.tsx
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
    date: string | Date;
}

export const FormattedDate: React.FC<Props> = ({ date }) => {
    // Convert to UTC date to ensure consistent display
    const utcDate = new Date(date);
    const formatted = format(utcDate, "d 'de' MMMM 'de' yyyy", { locale: es });

    return <span>{formatted}</span>;
};
