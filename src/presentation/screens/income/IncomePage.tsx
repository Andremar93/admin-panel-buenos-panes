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
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Gestión de Ingresos</h1>
        <p className="page-subtitle">
          Crea nuevos ingresos y administra los existentes
        </p>
      </div>

      {error && <p className="text-red-600 font-medium">{error}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Columna Izquierda - Formulario */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">

                {selectedIncome ? 'Editar Ingreso' : ' Crear Nuevo Ingreso'}
              </h2>
            </div>
            <div className="card-body">
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
          </div>
        </div>


        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Facturas</h2>
            </div>
            <div className="card-body">
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
          </div>
        </div>
      </div>
    </div>
  );
};
