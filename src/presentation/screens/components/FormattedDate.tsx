// components/FormattedDueDate.tsx
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
    date: string | Date;
}

export const FormattedDate: React.FC<Props> = ({ date }) => {
    const formatted = format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: es });

    return <span>{formatted}</span>;
};
