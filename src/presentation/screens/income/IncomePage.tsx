import { useIncome } from '@/hooks/useIncome'
import React, { useState, useEffect } from 'react';
import { CreateIncomeDTOType } from '@/presentation/dtos/income/createIncomeDto';
import { EditIncomeForm } from '@/presentation/screens/income/EditIcomeForm';
import { CreateIncomeForm } from '@/presentation/screens/income/CreateIncomeForm';
import { IncomeList } from '@/presentation/screens/income/IncomeList';

export function IncomePage() {

  const { incomes, loading, error, createIncome, updateIncome, applyFilters, filterRange } = useIncome()
  const [selectedIncome, setSelectedIncome] = useState<CreateIncomeDTOType | null>(null);
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');


  useEffect(() => {
    if (filterRange.from && filterRange.to) {
      setStartDate(filterRange.from.split('T')[0]);
      setFinishDate(filterRange.to.split('T')[0]);
    }
  }, [filterRange]);

  // const onDelete = async (incomeId: string) => {
  //   await deleteIncome(incomeId);
  // }

  const handleCreated = async (data: CreateIncomeDTOType) => {
    await createIncome(data); // esto actualiza el estado del hook
  };

  const handleUpdated = async (incomeId: string, data: CreateIncomeDTOType) => {
    await updateIncome(data, incomeId);
  };


  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>



      <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: 20 }}>
        {error && <p className="text-red-600 font-medium">{error}</p>}

        {selectedIncome ? (
          <EditIncomeForm
            initialData={selectedIncome}
            onCancel={() => setSelectedIncome(null)}
            onUpdated={handleUpdated}
          />
        ) : (
          <CreateIncomeForm onCreated={handleCreated} />
        )}
      </div>

      <IncomeList
        incomes={incomes}
        loading={loading}
        error={error}
        onEdit={setSelectedIncome}
        startDate={startDate}
        finishDate={finishDate}
        setStartDate={setStartDate}
        setFinishDate={setFinishDate}
        onFilter={() => applyFilters(startDate, finishDate)}
      />

    </div>
  )
}
