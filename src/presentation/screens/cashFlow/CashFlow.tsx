import { useEffect, useState, useMemo } from "react";
import { useIncome } from "@/hooks/useIncome";
import { useMonthlyCashFlow } from "@/hooks/useCashFlow";
import { FormattedAmount } from "../components/FormattedAmount";
import { useExchangeRate } from '@/hooks/useExchangeRate';


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

/* =========================
   ChartJS Registration
========================= */

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

/* =========================
   Helpers
========================= */

/* =========================
   Charts
========================= */

const CashFlowByAccounts = ({ days }: any) => {

  const data = {
    labels: days.map((d: any) =>
      new Date(d.date).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
      })
    ),
    datasets: [
      // 🟢 Ingresos
      {
        type: "bar",
        label: "Ingresos Cuenta",
        data: days.map((d: any) => d.ingresosCuenta),
        backgroundColor: "rgba(34,197,94,0.75)", // emerald-500
        borderRadius: 6,
        yAxisID: "y",
      },

      // 🔴 Gastos
      {
        type: "bar",
        label: "Gastos Cuenta",
        data: days.map((d: any) => d.gastosCuenta),
        backgroundColor: "rgba(239,68,68,0.75)", // red-500
        borderRadius: 6,
        yAxisID: "y",
      },

      // 🔵 Neto Diario
      {
        type: "line",
        label: "Net Diario",
        data: days.map((d: any) => d.netCuenta),
        borderColor: "#2563EB", // blue-600
        backgroundColor: "#2563EB",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
        yAxisID: "y",
      },

      // 🟣 Acumulado
      {
        type: "line",
        label: "Acumulado",
        data: days.map((d: any) => d.accumulatedCuenta),
        borderColor: "#7C3AED", // violet-600
        backgroundColor: "#7C3AED",
        tension: 0.35,
        borderWidth: 4,
        pointRadius: 0,
        fill: false,
        yAxisID: "y",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        position: "left" as const,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
    },
  };

  return (
    <div className="h-[520px]">
      <Bar data={data} options={options} />
    </div>
  );
};

const CashFlowByEfectivoBs = ({ days }: any) => {
  const data = {
    labels: days.map((d: any) =>
      new Date(d.date).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
      })
    ),
    datasets: [
      // 🟢 Ingresos
      {
        type: "bar",
        label: "Ingresos Bs",
        data: days.map((d: any) => d.ingresosBsEfectivo),
        backgroundColor: "rgba(34,197,94,0.75)",
        borderRadius: 6,
        yAxisID: "y",
      },

      // 🔴 Gastos
      {
        type: "bar",
        label: "Gastos Bs",
        data: days.map((d: any) => d.gastosBsEfectivo),
        backgroundColor: "rgba(239,68,68,0.75)",
        borderRadius: 6,
        yAxisID: "y",
      },

      // 🔵 Net Diario
      {
        type: "line",
        label: "Net Diario Bs",
        data: days.map((d: any) => d.netBsEfectivo),
        borderColor: "#2563EB",
        backgroundColor: "#2563EB",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        fill: false,
        yAxisID: "y",
      },

      // 🟣 Acumulado
      {
        type: "line",
        label: "Acumulado Bs",
        data: days.map((d: any) => d.accumulatedBsEfectivo),
        borderColor: "#7C3AED",
        backgroundColor: "#7C3AED",
        borderWidth: 4,
        tension: 0.35,
        pointRadius: 0,
        fill: false,
        yAxisID: "y",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        position: "left" as const,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
    },
  };

  return (
    <div className="h-[520px]">
      <Bar data={data} options={options} />
    </div>
  );
};

const CashFlowUsdCashChart = ({ days }: any) => {
  const data = {
    labels: days.map((d: any) =>
      new Date(d.date).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
      })
    ),
    datasets: [
      // 🟢 Ingresos USD
      {
        type: "bar",
        label: "Ingresos USD",
        data: days.map((d: any) => d.ingresosUsdEfectivo),
        backgroundColor: "rgba(16,185,129,0.75)", // emerald-500
        borderRadius: 6,
        yAxisID: "y",
      },

      // 🔴 Gastos USD
      {
        type: "bar",
        label: "Gastos USD",
        data: days.map((d: any) => d.gastosUsdEfectivo),
        backgroundColor: "rgba(220,38,38,0.75)", // red-600
        borderRadius: 6,
        yAxisID: "y",
      },

      // 🔵 Net Diario USD
      {
        type: "line",
        label: "Net Diario USD",
        data: days.map((d: any) => d.netUsdEfectivo),
        borderColor: "#0EA5E9", // sky-500
        backgroundColor: "#0EA5E9",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        fill: false,
        yAxisID: "y",
      },

      // 🟠 Acumulado USD
      {
        type: "line",
        label: "Acumulado USD",
        data: days.map((d: any) => d.accumulatedUsdEfectivo),
        borderColor: "#F59E0B", // amber-500
        backgroundColor: "#F59E0B",
        borderWidth: 4,
        tension: 0.35,
        pointRadius: 0,
        fill: false,
        yAxisID: "y",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        position: "left" as const,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
    },
  };

  return (
    <div className="h-[520px]">
      <Bar data={data} options={options} />
    </div>
  );
};

/* =========================
   Main Component
========================= */

export const CashFlow = () => {
  const today = new Date();

  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [currencyView] = useState<"USD" | "Bs">("USD");
  const { exchangeRate, getExchangeRate } = useExchangeRate();


  useEffect(() => {
    getExchangeRate(new Date().toISOString().split('T')[0]);
  }, [getExchangeRate]);

  const [selectedChart, setSelectedChart] = useState<
    "cuentas" | "bs" | "usd"
  >("cuentas");

  const { data, isLoading } = useMonthlyCashFlow(
    selectedYear,
    selectedMonth,
    currencyView
  );

  const { incomes, loading, error, applyFilters } = useIncome();

  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");

  /* =========================
     Set Yesterday By Default
  ========================= */

  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0] ?? "";
    setStartDate(dateStr);
    setFinishDate(dateStr);
  }, []);

  useEffect(() => {
    if (startDate && finishDate) {
      applyFilters(startDate, finishDate);
    }
  }, [startDate, finishDate, applyFilters]);

  /* =========================
     Account Balances
  ========================= */


  const totalsByMethod = useMemo(() => {
    if (!data || data.days.length === 0) return null;

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Filtrar días <= hoy
    const daysUntilToday = data.days.filter((d: any) => {
      const date = new Date(d.date);
      return date <= today;
    });

    if (daysUntilToday.length === 0) return null;

    const lastValidDay = daysUntilToday[daysUntilToday.length - 1];

    return {
      netCuenta: lastValidDay.accumulatedCuenta,
      netBsEfectivo: lastValidDay.accumulatedBsEfectivo,
      netUsdEfectivo: lastValidDay.accumulatedUsdEfectivo,
    };
  }, [data]);

  const convertedTotals = useMemo(() => {
    if (!totalsByMethod || !exchangeRate) return null;

    return {
      cuentaUsd: totalsByMethod.netCuenta / exchangeRate.rate,
      bsUsd: totalsByMethod.netBsEfectivo / exchangeRate.rate,
      usdUsd: totalsByMethod.netUsdEfectivo, // ya está en USD
    };
  }, [totalsByMethod, exchangeRate]);


  /* =========================
     Render
  ========================= */

  return (
    <div className="page-container space-y-10">


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Resultado Cuenta
          </p>

          <p className={`text-2xl font-bold mt-2 ${(totalsByMethod?.netCuenta || 0) < 0
            ? "text-red-600"
            : "text-blue-600"
            }`}>
            <FormattedAmount
              amount={totalsByMethod?.netCuenta || 0}
              currency="Bs"
            />
          </p>

          {convertedTotals && (
            <p className={`text-2xl font-bold mt-2 ${convertedTotals.cuentaUsd < 0
              ? "text-red-600"
              : "text-blue-600"
              }`}>
              <FormattedAmount
                amount={convertedTotals.cuentaUsd}
                currency="USD"
              />
            </p>
          )}
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Resultado Bs Efectivo
          </p>

          <p className={`text-2xl font-bold mt-2 ${(totalsByMethod?.netBsEfectivo || 0) < 0
              ? "text-red-600"
              : "text-green-600"
            }`}>
            <FormattedAmount
              amount={totalsByMethod?.netBsEfectivo || 0}
              currency="Bs"
            />
          </p>

          {convertedTotals && (
            <p className={`text-2xl font-bold mt-2 ${convertedTotals.bsUsd < 0
                ? "text-red-600"
                : "text-green-600"
              }`}>
              <FormattedAmount
                amount={convertedTotals.bsUsd}
                currency="USD"
              />
            </p>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Resultado USD
          </p>
          <p className={`text-2xl font-bold mt-2 ${(totalsByMethod?.netUsdEfectivo || 0) < 0
            ? "text-red-600"
            : "text-amber-600"
            }`}>
            <FormattedAmount
              amount={totalsByMethod?.netUsdEfectivo || 0}
              currency="USD"
            />
          </p>
        </div>

      </div>



      {/* ===== Monthly Summary ===== */}

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">


          <div>
            <h2 className="text-xl font-bold">Flujo Mensual</h2>
            <p className="text-sm text-gray-500">
              Ingresos vs gastos acumulados del mes
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <p>Cargando flujo...</p>
        ) : (
          data && (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm">Días Registrados</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {data.days.length}
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm">Días Negativos</p>
                  <p className="text-2xl font-bold text-red-600">
                    {data.days.filter((d: any) => d.net < 0).length}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                  onClick={() => setSelectedChart("cuentas")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${selectedChart === "cuentas"
                    ? "bg-white shadow text-blue-600"
                    : "text-gray-500"
                    }`}
                >
                  Cuentas Bs
                </button>

                <button
                  onClick={() => setSelectedChart("bs")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${selectedChart === "bs"
                    ? "bg-white shadow text-green-600"
                    : "text-gray-500"
                    }`}
                >
                  Efectivo Bs
                </button>

                <button
                  onClick={() => setSelectedChart("usd")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${selectedChart === "usd"
                    ? "bg-white shadow text-amber-600"
                    : "text-gray-500"
                    }`}
                >
                  USD
                </button>
              </div>

              {/* Charts */}
              <div className="space-y-8">

                <div className="bg-white p-6 rounded-xl shadow-md">
                  {selectedChart === "cuentas" && (
                    <CashFlowByAccounts days={data.days} />
                  )}

                  {selectedChart === "bs" && (
                    <CashFlowByEfectivoBs days={data.days} />
                  )}

                  {selectedChart === "usd" && (
                    <CashFlowUsdCashChart days={data.days} />
                  )}
                </div>
              </div>
            </>
          )
        )}




      </div>

      {/* ===== Expected Balances Section ===== */}

      {/* <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Total Esperado</h2>
        <p className="text-4xl font-bold">
          <FormattedAmount amount={totalExpected} currency="Bs" />
        </p>
      </div> */}

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p>Cargando ingresos...</p>}
    </div>
  );
};