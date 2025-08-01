import { CreateIncomeDTOType } from "@/presentation/dtos/income/createIncomeDto";
import { CreateIncomeForm } from "../income/CreateIncomeForm"
import { useIncome } from '@/hooks/useIncome'


export const IncomeCashier = () => {
    const { loading, error, createIncome } = useIncome()

    const handleCreated = async (data: CreateIncomeDTOType) => {
        await createIncome(data); 
    };


    return (
        <div style={{ padding: 20 }}>
            <CreateIncomeForm onCreated={handleCreated}>

            </CreateIncomeForm>
        </div>
    )
}