import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { IncomePage } from './presentation/screens/income/IncomePage';
import { LoginPage } from './presentation/screens/login/LoginPage';
import { DashboardPage } from './presentation/screens/dashboard/DashboardPage';
import { ExpensePage } from './presentation/screens/expense/ExpensePage';
import { EmployeeSalaryPage } from './presentation/screens/employee/salary/EmployeeSalaryPage'
import { EmployeeDebtPage } from './presentation/screens/employee/debt/EmployeeDebtPage'
import { InvoicePage } from './presentation/screens/invoice/InvoicePage';
import PrivateRoute from './presentation/components/PrivateRoute';
import { IncomeCashier } from './presentation/screens/incomeCashier/IncomeCashier';
import UnauthorizedPage from './presentation/screens/components/UnauthorizedPage';
import { CashFlow } from './presentation/screens/cashFlow/CashFlow';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Rutas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/caja" element={<IncomeCashier />} />
        </Route>

        {/* Rutas protegidas */}
        <Route element={<PrivateRoute requiredRole="admin" />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/ingresos" element={<IncomePage />} />
          <Route path="/gastos" element={<ExpensePage />} />
          <Route path="/facturas" element={<InvoicePage />} />
          <Route path="/salarios" element={<EmployeeSalaryPage />} />
          <Route path="/deudas-empleados" element={<EmployeeDebtPage />} />
          <Route path="/flujo-caja" element={<CashFlow />} />
        </Route>

        {/* Redirección raíz */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
