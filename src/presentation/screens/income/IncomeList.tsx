import { Income } from '@/domain/model/Income';
import React from 'react';
import { CreateIncomeDTOType } from '@/presentation/dtos/income/createIncomeDto';
import { FormattedAmount } from '../components/FormattedAmount';

interface Props {
    incomes: Income[];
    // onDelete: (incomeId: String) => void;
    loading: boolean;
    error: string | null;
    onEdit: (income: CreateIncomeDTOType) => void;
    startDate: string;
    finishDate: string;
    setStartDate: (value: string) => void;
    setFinishDate: (value: string) => void;
    onFilter: () => void;
}

export const IncomeList: React.FC<Props> = ({ incomes, loading, error, onEdit, startDate, setStartDate, finishDate, setFinishDate, onFilter }) => {

    const totals = incomes.reduce(
        (acc, inv) => {
            const rate = inv.rate && inv.rate !== 0 ? inv.rate : 100;

            acc.efectivoDolares += inv.efectivoDolares;
            acc.efectivoBs += inv.efectivoBs;
            acc.sitef += inv.sitef;
            acc.pagomovil += inv.pagomovil;
            acc.biopago += inv.biopago;
            acc.puntoExterno += inv.puntoExterno;
            acc.gastosBs += inv.gastosBs;
            acc.gastosDolares += inv.gastosDolares;
            acc.totalSistema += inv.totalSistema

            // Conversión a USD
            acc.efectivoBsUSD += inv.efectivoBs / rate;
            acc.sitefUSD += inv.sitef / rate;
            acc.pagomovilUSD += inv.pagomovil / rate;
            acc.biopagoUSD += inv.biopago / rate;
            acc.puntoExternoUSD += inv.puntoExterno / rate;
            acc.gastosBsUSD += inv.gastosBs / rate;

            return acc;
        },
        {
            efectivoDolares: 0,
            efectivoBs: 0,
            sitef: 0,
            pagomovil: 0,
            biopago: 0,
            puntoExterno: 0,
            gastosBs: 0,
            gastosDolares: 0,
            efectivoBsUSD: 0,
            sitefUSD: 0,
            pagomovilUSD: 0,
            biopagoUSD: 0,
            puntoExternoUSD: 0,
            gastosBsUSD: 0,
            totalSistema: 0
        }
    );

    const totalIngresosUSD =
        totals.efectivoDolares +
        totals.efectivoBsUSD +
        totals.sitefUSD +
        totals.pagomovilUSD +
        totals.biopagoUSD +
        totals.puntoExternoUSD;

    return (
        <div style={{ flex: 1, paddingLeft: 20 }}>
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-xl shadow-sm">
                <h2 className="text-base font-semibold text-yellow-800 mb-3">💰 Total Ingresos: <FormattedAmount amount={totalIngresosUSD} currency="USD" /> vs Sistema: <FormattedAmount amount={totals.totalSistema} currency="USD" /></h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-yellow-900 space-y-2">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between col-span-2 ">
                            <p className="font-medium">
                                💵 Efectivo USD: <FormattedAmount amount={totals.efectivoDolares} currency="USD" />
                            </p>
                        </div>
                        <div>
                            <p className="font-medium">
                                💴 Efectivo Bs :
                                {/* <FormattedAmount amount={totals.efectivoBs} currency="USD" /> -  */}
                                <FormattedAmount amount={totals.efectivoBsUSD} currency="USD" />
                            </p>
                        </div>

                        <div>
                            <p className="font-medium">
                                🏦 Punto Externo:
                                {/* {totals.puntoExterno.toFixed(2)} Bs -  */}
                                <FormattedAmount amount={totals.puntoExternoUSD} currency="USD" />
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div>
                            <p className="font-medium">
                                🧾 Sitef:
                                {/* {totals.sitef.toFixed(2)} Bs -  */}
                                <FormattedAmount amount={totals.sitefUSD} currency="USD" />
                            </p>
                        </div>

                        <div>
                            <p className="font-medium">
                                📲 Pago Móvil:
                                {/*  {totals.pagomovil.toFixed(2)} Bs -    */}
                                <FormattedAmount amount={totals.pagomovilUSD} currency="USD" />
                            </p>
                        </div>

                        <div>
                            <p className="font-medium">
                                🔐 Biopago:
                                {/* {totals.biopago.toFixed(2)} Bs - */}
                                <FormattedAmount amount={totals.biopagoUSD} currency="USD" />
                            </p>
                        </div>
                    </div>

                </div>

                <hr className="my-2 border-t border-gray-300" />

                <div className="grid grid-cols-2 gap-4 text-sm text-yellow-900">
                    <div>
                        Total Externo:  <FormattedAmount amount={totals.efectivoDolares + totals.efectivoBsUSD + totals.puntoExternoUSD} currency="USD" />
                    </div>
                    <div>
                        Total Legal:  <FormattedAmount amount={totals.sitefUSD + totals.pagomovilUSD + totals.biopagoUSD} currency="USD" />
                    </div>
                </div>

            </div>

            {/* 
            <input
                type="text"
                placeholder="Buscar por proveedor o número de ingreso"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="input mb-4"
            /> */}

            {loading && <p className="text-gray-500">Cargando ingresos...</p>}
            {error && <p className="text-red-600 font-medium">{error}</p>}
            {!loading && incomes.length === 0 && <p className="text-gray-400">No hay ingresos registrados.</p>}

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-4 items-end mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                        <input
                            type="date"
                            className="border border-gray-300 rounded px-3 py-2"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 form-label">Hasta</label>
                        <input
                            type="date"
                            className="border border-gray-300 rounded px-3 py-2"
                            value={finishDate}
                            onChange={(e) => setFinishDate(e.target.value)}
                        />
                    </div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={onFilter}
                        disabled={!startDate || !finishDate}
                    >
                        Filtrar
                    </button>
                </div>

            </div>


            <ul className="space-y-4 max-h-[600px] overflow-y-auto">
                {incomes.map((income) => {
                    const showDollarEquivalent = (income.rate != null && income.rate !== 0) ? income.rate : 100;

                    const sitefUSD = showDollarEquivalent ? income.sitef / showDollarEquivalent : 0;
                    const biopagoUSD = showDollarEquivalent ? income.biopago / showDollarEquivalent : 0;
                    const puntoExternoUSD = showDollarEquivalent ? income.puntoExterno / showDollarEquivalent : 0;
                    const pagomovilUSD = showDollarEquivalent ? income.pagomovil / showDollarEquivalent : 0;
                    const efectivoBsUSD = showDollarEquivalent ? income.efectivoBs / showDollarEquivalent : 0;
                    const gastosBsUSD = showDollarEquivalent ? income.gastosBs / showDollarEquivalent : 0;
                    const totalUSD = (income.gastosDolares + gastosBsUSD + sitefUSD + biopagoUSD + puntoExternoUSD + pagomovilUSD + efectivoBsUSD + income.efectivoDolares).toFixed(2);

                    return (
                        <li key={income._id} className="bg-white p-4 rounded-xl shadow space-y-2 text-sm text-gray-800 my-2 ml-4 mr-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-primary">
                                    {new Date(income.date).toISOString().split('T')[0]}
                                </h3>
                                <button onClick={() => onEdit(income)} className="text-blue-600 text-sm underline">
                                    Editar
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 text-sm">

                                <div>
                                    {/* Ingreso USD y Bs */}
                                    <div>
                                        {/* <p className="text-gray-600 font-medium">💵 Ingreso USD</p> */}
                                        <p>$ Efectivo: <FormattedAmount amount={income.efectivoDolares} currency="USD" /></p>

                                        {/* <p className="mt-2 text-gray-600 font-medium">💵 Ingreso Bs</p> */}
                                        <p>Bs Efectivo: <FormattedAmount amount={income.efectivoBs} currency="Bs" prefix="" bold={false} /> - <FormattedAmount amount={efectivoBsUSD} currency="USD" /> </p>

                                        <p>Punto Externo: <FormattedAmount amount={income.puntoExterno} currency="Bs" prefix="" bold={false} /> - <FormattedAmount amount={puntoExternoUSD} currency="USD" /> </p>
                                    </div>
                                </div>

                                <div>

                                    {/* Otros ingresos en Bs */}
                                    <div>
                                        {/* <p className="text-gray-600 font-medium">💳 Ingreso Bs</p> */}
                                        <p>Sitef: <FormattedAmount amount={income.sitef} currency="Bs" bold={false} prefix="" /> - <FormattedAmount amount={sitefUSD} currency="USD" /> </p>
                                        <p>Pagomovil: <FormattedAmount amount={income.pagomovil} currency="Bs" prefix="" bold={false} /> - <FormattedAmount amount={pagomovilUSD} currency="USD" /> </p>
                                        <p>Biopago: <FormattedAmount amount={income.biopago} currency="Bs" prefix="" bold={false} /> - <FormattedAmount amount={biopagoUSD} currency="USD" /> </p>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-2 border-t border-gray-300" />


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 text-sm">

                                {/* Gastos */}
                                <div>
                                    <p className="text-gray-600 font-medium">📉 Gastos</p>
                                    <p>Gastos Bs: <FormattedAmount amount={income.gastosBs} currency="Bs" prefix="" bold={false} /> -
                                        <FormattedAmount amount={gastosBsUSD} currency="USD" /></p>
                                    <p>Gastos USD: <FormattedAmount amount={income.gastosDolares} currency="USD" /></p>
                                </div>

                                {/* Conversión */}
                                {showDollarEquivalent && (
                                    <div>
                                        <p className="text-gray-600 font-medium">🔁 Conversión</p>
                                        <p>Tasa: {showDollarEquivalent} Bs</p>
                                        <p>Total equivalente en USD: <strong>${totalUSD}</strong></p>
                                        <p>Reporte Sistema USD: <strong>${income.totalSistema.toFixed(2)}</strong></p>
                                    </div>
                                )}
                            </div>



                            {income.notas && (
                                <div className="mt-2 text-gray-500 text-xs italic border-t pt-2">
                                    {income.notas}
                                </div>
                            )}
                        </li>

                    );
                })}
            </ul>

        </div>
    );
};
